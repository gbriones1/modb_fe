import { clickView, dateTimeFormatter, priceFormatter, defaultDeleteSingleModal, defaultMultiDeleteModal, doREST, clickEdit, boolFormatter, doPrint, handleAPIErrors, updateFormData } from "../tableUtils";
import history from "../history";
import config from "../config";

const $ = require('jquery');

let products = JSON.parse(localStorage.getItem("product_ids") || "{}");
let provider_products = JSON.parse(localStorage.getItem("provider_products_ids") || "{}");
let customer_products = JSON.parse(localStorage.getItem("customer_products_ids") || "{}");
let providers = JSON.parse(localStorage.getItem("provider") || "[]");

let provider_options = ""
for (let p of providers){
    provider_options += '<option value='+p.id+'>'+p.name+'</option>'
}

$(document).on('click', 'button.order-nav', function(){
    // console.log($(this).data());
    history.push("/work_order?workbuy_ids="+$(this).data().id)
})

$(document).on('click', 'button.work-nav', function(){
    // console.log($(this).data());
    history.push("/work?workbuy_ids="+$(this).data().id)
})

$(document).on('click', 'button.custom-view', function(){
    // console.log($(this).data());
    let iframe =  $("iframe.view-iframe");
    iframe.attr('src', $(this).data().endpoint+"/"+$(this).data().objectId)
})

$(document).on('click', 'button.order-edit', function(){
    let data = $(this).data('object');
    let modal = $('#order-edit.modal');
    let form = modal.find('form');
    modal.attr("obj-id", data.id)
    updateFormData(form, data)
})

$(document).on('click', 'button.order_products', function(){
    let data = $(this).data('object');
    let modal = $('#order_products.modal');
    let form = modal.find('form');
    modal.attr("obj-id", data.id)
    updateFormData(form, data)
})

$(document).on('click', 'button.work-edit', function(){
    let data = $(this).data('object');
    let modal = $('#work-edit.modal');
    let form = modal.find('form');
    modal.attr("obj-id", data.id)
    updateFormData(form, data)
})

$(document).on('click', 'button.work_products', function(){
    let data = $(this).data('object');
    let modal = $('#work_products.modal');
    let form = modal.find('form');
    modal.attr("obj-id", data.id)
    updateFormData(form, data)
})

$(document).on('click', 'button.work-order', function(){
    // console.log($(this).data('object'));
    let modal = $('#work-order.modal');
    let form = modal.find('form');
    let data = $(this).data('object');
    modal.attr('obj-id', data.id);
    form.empty();
    let table = $('<table class="table table-sm table-hover">')
    let thead = $('<thead>')
    thead.append("<tr><th>Proveedor</th><th>Producto</th><th>Cantidad</th></tr>")
    let tbody = $('<tbody>')
    for (let i in data.work_products){
        let wp = data.work_products[i]
        // console.log(wp)
        tbody.append('<tr><td><select name="work_product_providers['+wp.id+']" class="form-select"><option></option>'+provider_options+'</select></td><td>'+products[wp.product.id].name+' '+products[wp.product.id].description+'</td><td>'+wp.amount+'</td></tr>')
    }
    for (let i in data.work_unregisteredproducts){
        let wup = data.work_unregisteredproducts[i]
        // console.log(wup)
        tbody.append('<tr><td><select name="work_unregisteredproduct_providers['+wup.id+']" class="form-select"><option></option>'+provider_options+'</select></td><td>'+wup.code+' '+wup.description+'</td><td>'+wup.amount+'</td></tr>')
    }
    for (let i in data.work_customer_products){
        let wcp = data.work_customer_products[i]
        // console.log(wcp)
        tbody.append('<tr><td><select name="work_customer_product_providers['+wcp.id+']" class="form-select"><option></option>'+provider_options+'</select></td><td>'+products[customer_products[wcp.customer_product.id].product.id].name+' '+products[customer_products[wcp.customer_product.id].product.id].description+'</td><td>'+wcp.amount+'</td></tr>')
    }
    table.append(thead)
    table.append(tbody)
    form.append(table)
})

const baseFormConfig = {
    fields: [
        {
            type: "select",
            name: "customer_id",
            label: "Cliente",
            endpoint: "customer",
        }, {
            type: "select",
            name: "organization_id",
            label: "Organizacion",
            endpoint: "organization",
        }, {
            type: "formTable",
            name: "orders",
            label: "Ordenes de compra",
            fields: [
                {
                    name: "provider_id",
                    label: "Proveedor",
                    type: "select",
                    endpoint: "provider"
                }, {
                    name: "taxpayer_id",
                    label: "Razon social",
                    type: "select",
                    endpoint: "taxpayer"
                }, {
                    name: "claimant_id",
                    label: "Recolector",
                    type: "select",
                    endpoint: "employee"
                }, {
                    name: "authorized",
                    label: "Autorizado",
                    defaultValue: true,
                    type: "checkbox",
                }, 
            ],
        }, {
            type: "formTable",
            name: "works",
            label: "Hojas de trabajo",
            fields: [
                {
                    name: "number",
                    label: "Folio",
                    type: "text",
                }, {
                    name: "unit",
                    label: "Unidad",
                    type: "text",
                }, {
                    name: "model",
                    label: "Modelo",
                    type: "text",
                }, {
                    name: "taxpayer_id",
                    label: "Razon social",
                    type: "select",
                    endpoint: "taxpayer"
                }, {
                    name: "authorized",
                    label: "Autorizado",
                    defaultValue: true,
                    type: "checkbox",
                }, 
            ],
        }
    ]
}

function multichoiceProviderProductFormatter(data){
    if (data.product){
        try {
            var product = products[data.product.id];
            return data.code +" - "+ product.name + " - " + product.description
        } catch {
            products = JSON.parse(localStorage.getItem("product_ids") || "{}");
            let product = products[data.product.id];
            if (product){
                return data.code +" - "+ product.name + " - " + product.description
            }
            return data.code
        }
    }
}

function multichoiceProductFormatter(data){
    if (data.product){
        try {
            var product = products[data.product.id];
            return data.code +" - "+ product.name + " - " + product.description
        } catch {
            products = JSON.parse(localStorage.getItem("product_ids") || "{}");
            let product = products[data.product.id];
            if (product){
                return data.code +" - "+ product.name + " - " + product.description
            }
            return data.code
        }
    }
}

function multichoiceOtherProductFormatter(data){
    return data.code +" - "+ data.name + " - " + data.description
}

function multichoiceEmployeeFormatter(data){
    return data.name
}

function detailViewFormatter(index, row, element){
    var table = '<div class="card"><div class="card-body">'
    table += '<div class="row"><div class="col"><h4>Ordenes de Compra</h4></div><div class="col-md-2">'
    // table += '<button type="button" class="btn btn-success order-nav" data-id="'+row.id+'"><i class="far fa-edit" style="width: 14px;"></i></button>'
    table += '</div></div>'
    table += '<table class="table table-sm table-hover"><tr><th>Folio</th><th>Proveedor</th><th>Razon social</th><th>Autorizado</th><th>Total</th><th>Acciones</th></tr><tbody>'
    var index_in_workbuy = 0
    for (let o of row.orders){
        index_in_workbuy++
        table += '<tr><td>'+row.number+' - '+index_in_workbuy+'</td><td>'+o.provider.name+'</td><td>'+o.taxpayer.name+'</td><td>'+boolFormatter(o.authorized)+'</td><td>$'+o.total.toFixed(2)+'</td><td>'
        table += '<button type="button" class="btn btn-info custom-view" data-endpoint="work_order" data-object-id="'+o.id+'" data-bs-toggle="modal" data-bs-target="#view"><i class="far fa-eye" style="width: 14px;"></i></button>'
        table += '<button type="button" class="btn btn-primary order-edit" data-object=\''+JSON.stringify(o)+'\' data-bs-toggle="modal" data-bs-target="#order-edit"><i class="fas fa-edit" style="width: 14px;"></i></button>'
        table += '<button type="button" class="btn btn-primary order_products" data-object=\''+JSON.stringify(o)+'\' data-bs-toggle="modal" data-bs-target="#order_products"><i class="fas fa-clipboard-list" style="width: 14px;"></i></button>'
        // table += '<button type="button" class="btn btn-primary order-work" data-object=\''+JSON.stringify(o)+'\' data-bs-toggle="modal" data-bs-target="#order-work"><i class="fas fa-tools" style="width: 14px;"></i></button>'
        table += '</td></tr>'
    }
    table += '</tbody></table>'
    table += '</div></div>'
    table += '<div class="card"><div class="card-body">'
    table += '<div class="row"><div class="col"><h4>Hojas de trabajo</h4></div><div class="col-md-2">'
    // table += '<button type="button" class="btn btn-success work-nav" data-id="'+row.id+'"><i class="far fa-edit" style="width: 14px;"></i></button>'
    table += '</div></div>'
    table += '<table class="table table-sm table-hover"><tr><th>Numero</th><th>Unidad</th><th>Modelo</th><th>Razon social</th><th>Autorizado</th><th>Total</th><th>Acciones</th></tr><tbody>'
    for (let o of row.works){
        // objData = JSON.stringify(o)
        table += '<tr><td>'+o.number+'</td><td>'+o.unit+'</td><td>'+o.model+'</td><td>'+o.taxpayer.name+'</td><td>'+boolFormatter(o.authorized)+'</td><td>$'+o.total.toFixed(2)+'</td><td>'
        table += '<button type="button" class="btn btn-info custom-view" data-endpoint="work" data-object-id="'+o.id+'" data-bs-toggle="modal" data-bs-target="#view"><i class="far fa-eye" style="width: 14px;"></i></button>'
        table += '<button type="button" class="btn btn-primary work-edit" data-object=\''+JSON.stringify(o)+'\' data-bs-toggle="modal" data-bs-target="#work-edit"><i class="fas fa-edit" style="width: 14px;"></i></button>'
        table += '<button type="button" class="btn btn-primary work_products" data-object=\''+JSON.stringify(o)+'\' data-bs-toggle="modal" data-bs-target="#work_products"><i class="fas fa-clipboard-list" style="width: 14px;"></i></button>'
        table += '<button type="button" class="btn btn-primary work-order" data-object=\''+JSON.stringify(o)+'\' data-bs-toggle="modal" data-bs-target="#work-order"><i class="fas fa-shopping-cart" style="width: 14px;"></i></button>'
        table += '</td></tr>'
    }
    table += '</tbody></table>'
    table += '</div></div>'
    return table
}

function detailSheetFormatter(row){
    // console.log(row)
    if (row && Object.keys(row).length !== 0){
        var table = '<br><h4>Ordenes de Compra</h4><br><table class="table table-hover table-stripped"><thead><tr class="table-dark"><th>Folio</th><th>Fecha</th><th>Proveedor</th><th>Razon social</th><th>Autorizado</th><th></th></tr></thead><tbody>'
        // console.log(row)
        // console.log(Object.keys(row).length)
        // console.log(row.orders)
        var index_in_workbuy = 0
        for (var o of row.orders){
            index_in_workbuy++
            table += '<tr><td>'+row.number+' - '+index_in_workbuy+'</td><td>'+dateTimeFormatter(o.created_at)+'</td><td>'+o.provider.name+'</td><td>'+o.taxpayer.name+'</td><td>'+boolFormatter(o.authorized)+'</td><td></td></tr>'
            table += '<tr><td></td><td colspan="4"><table class="table table-sm table-hover table-bordered"><thead><tr><th>Cantidad</th><th>Codigo</th><th>Descripcion</th><th>Precio Unitario</th><th>Total</th></tr></thead><tbody>'
            for (let up of o.order_unregisteredproducts){
                table += '<tr><td>'+up.amount+'</td><td>'+up.code+'</td><td>'+up.description+'</td><td>$'+up.price+'</td><td>$'+(up.price*up.amount).toFixed(2)+'</td></tr>'
            }
            for (var op of o.order_provider_products){
                let p = {
                    name: "",
                    description: "",
                }
                try {
                    p = products[provider_products[op.provider_product.id].product.id]
                } catch {
                    products = JSON.parse(localStorage.getItem("product_ids"));
                    provider_products = JSON.parse(localStorage.getItem("provider_products_ids"))
                    if (products && provider_products){
                        p = products[provider_products[op.provider_product.id].product.id]
                    }
                }
                table += '<tr><td>'+op.amount+'</td><td>'+op.provider_product.code+'</td><td>'+p.name+" - "+p.description+'</td><td>$'+op.price+'</td><td>$'+(op.price*op.amount).toFixed(2)+'</td></tr>'
            }
            table += '</tbody><tfoot><tr><th colspan="4" style="text-align:end;">Sub total</th><th>$'+o.subtotal.toFixed(2)+'</th></tr>'
            if (o.discount){
                table += '<tr><th colspan="4" style="text-align:end;">Descuento</th><th>-$'+o.discount.toFixed(2)+'</th></tr>'
            }
            if (o.include_iva) {
                table += '<tr><th colspan="4" style="text-align:end;">IVA</th><th>$'+((o.subtotal-o.discount)*0.16).toFixed(2)+'</th></tr>'
            }
            table += '<tr><th colspan="4" style="text-align:end;">Total</th><th>$'+o.total.toFixed(2)+'</th></tr>'
            table += '</tfoot></table></td></tr>'

        }
        table += '</tbody></table>'
        return table
    }
    return ""
}

function doOrderREST (endpoint, method, modalName, btnName, successHook, setNotifications) {
    doREST("/order", method, modalName, btnName, successHook, setNotifications)
}

function doWorkREST (endpoint, method, modalName, btnName, successHook, setNotifications) {
    doREST("/work", method, modalName, btnName, successHook, setNotifications)
}

function doWorkOrder (endpoint, method, modalName, btnName, successHook, setNotifications) {
    console.log("doWorkOrder")
    let modal = $(".modal#"+modalName)
    let url = config.apiURL+"/work_order/"+modal.attr("obj-id");
    let token = localStorage.getItem('token');
    let form = modal.find("form");
    let button = modal.find("button."+btnName);
    button.attr('disabled', true)
    let ajax_config = {
        url: url,
        type: method,
        headers: {Authorization: "Bearer "+token},
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
            button.attr('disabled', false)
            modal.find('[aria-label="Close"]').trigger({type: "click"});
            successHook();
        },
        error: function (data) {
            if (data.status === 401){
                localStorage.removeItem('token');
                window.location.reload();
            }
            button.attr('disabled', false)
            console.log(data)
            handleAPIErrors(data.responseJSON, form)
        }
    };
    var data = JSON.parse(form.serializeFormJSON());
    var request_data = {
        work_product_providers: {},
        work_unregisteredproduct_providers: {},
        work_customer_product_providers: {},
    }
    for (let x in data) {
        if (data[x]){
            request_data[x.split("[")[0]][x.split("[")[1].slice(0,-1)] = data[x]
        }
    }
    ajax_config.data = JSON.stringify(request_data);
    console.log("Sending data")
    console.log(JSON.parse(ajax_config.data));
    $.ajax(ajax_config);
    console.log("REST call sent")
}

var workbuys = {
    name: "Registro de trabajos",
    endpoint: "/workbuy",
    daterange_filters: true,
    table: {
        properties: {
            filterControl: true,
            pagination: true,
            search: true,
            detailView: true,
            showColumns: true,
            showExport: true,
            exportTypes: ['png', 'csv', 'doc', 'excel', 'xlsx', 'pdf'],
            pageList: [10, 25, 50, 100, "all"],
            detailFormatter: detailViewFormatter,
            // responseHandler: responseHandler
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'number',
            title: 'Folio',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'created_at',
            title: 'Fecha',
            sortable: true,
            filterControl: 'input',
            formatter: dateTimeFormatter,
        }, {
            field: 'customer.name',
            title: 'Cliente',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'organization.name',
            title: 'Organizacion',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'works_number',
            title: 'Trabajos',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'orders_number',
            title: 'Ordenes',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'works_total',
            title: 'Vendido',
            sortable: true,
            filterControl: 'input',
            formatter: priceFormatter
        }, {
            field: 'total',
            title: 'Gastado',
            sortable: true,
            filterControl: 'input',
            formatter: priceFormatter
        }, {
            field: 'earnings',
            title: 'Utilidad',
            sortable: true,
            filterControl: 'input',
            formatter: priceFormatter
        }],
        rowActions: [
            {
                name: "view",
                button: {
                    icon: ["far", "eye"],
                    event: clickView,
                },
                modal: {
                    title: 'Visualizar registro',
                    size: 'xl',
                    buttons: [
                        {
                            name: "do-print",
                            text: "Imprimir",
                            variant: "success",
                            method: "",
                            onClick: doPrint,
                        }
                    ],
                    content: {
                        type: "iframe"
                    }
                }
            },
            {
                name: "edit",
                button: {
                    name: "edit",
                    icon: ["far", "edit"],
                    event: clickEdit
                },
                modal: {
                    title: 'Editar',
                    size: 'xl',
                    buttons: [
                        {
                            name: "do-edit",
                            text: "Guardar",
                            variant: "success",
                            method: "PUT",
                            onClick: doREST,
                        }
                    ],
                    content: {
                        type: "form",
                        config: baseFormConfig
                    }
                }
            },
            defaultDeleteSingleModal,
        ]
    },
    modalButtons: [
        {
            name: "new",
            button: {
                icon: ["far", "plus-square"],
                variant: "primary",
            },
            modal: {
                title: 'Nuevo',
                size: 'xl',
                buttons: [
                    {
                        name: "do-new",
                        text: "Crear",
                        variant: "primary",
                        method: "POST",
                        onClick: doREST,
                    }
                ],
                content: {
                    type: "form",
                    config: baseFormConfig
                }
            }
        },
        defaultMultiDeleteModal,
        {
            name: "order-edit",
            modal: {
                title: 'Editar orden de compra',
                size: 'xl',
                buttons: [
                    {
                        name: "do-order-edit",
                        text: "Guardar",
                        variant: "primary",
                        method: "PUT",
                        onClick: doOrderREST,
                    }
                ],
                content: {
                    type: "form",
                    config: {
                        fields: [
                            {
                                type: "hidden",
                                name: "provider",
                            }, {
                                type: "select",
                                name: "taxpayer_id",
                                label: "RFC",
                                endpoint: "taxpayer"
                            }, {
                                type: "select",
                                name: "claimant_id",
                                label: "Recolector",
                                endpoint: "employee"
                            }, {
                                type: "text",
                                name: "invoice_number",
                                label: "Numero de factura",
                            }, {
                                type: "date",
                                name: "invoice_date",
                                label: "Fecha de factura",
                            }, {
                                type: "checkbox",
                                name: "authorized",
                                label: "Autorizado"
                            }, {
                                type: "checkbox",
                                name: "include_iva",
                                label: "Incluir IVA"
                            }, {
                                type: "number",
                                name: "discount",
                                label: "Descuento",
                                step: 0.01
                            }, {
                                type: "text",
                                name: "comment",
                                label: "Observaciones",
                            }
                        ]
                    }
                }
            }
        }, {
            name: "order_products",
            modal: {
                title: 'Editar productos de orden de compra',
                size: 'xl',
                buttons: [
                    {
                        name: "do-order_products",
                        text: "Guardar",
                        variant: "primary",
                        method: "PUT",
                        onClick: doOrderREST,
                    }
                ],
                content: {
                    type: "form",
                    config: {
                        fields: [
                            {
                                type: "formTable",
                                name: "order_unregisteredproducts",
                                label: "Productos no registrados",
                                fields: [
                                    {
                                        name: "amount",
                                        label: "Cantidad",
                                        type: "number",
                                        defaultValue: 1,
                                        step: 1
                                    }, {
                                        name: "code",
                                        label: "Codigo",
                                        type: "text",
                                    }, {
                                        name: "description",
                                        label: "Descripcion",
                                        type: "text",
                                    }, {
                                        name: "price",
                                        label: "Precio Unitario",
                                        type: "number",
                                        defaultValue: 0.0,
                                        step: 0.01
                                    }, 
                                ],
                            }, {
                                type: "multichoice",
                                name: "order_provider_products",
                                label: "Productos registrados",
                                endpoint: "provider",
                                subfield: "provider_products",
                                formatter: multichoiceProviderProductFormatter,
                                fields: [
                                    {
                                        name: "amount",
                                        label: "Cantidad",
                                        type: "number",
                                    }, {
                                        name: "price",
                                        label: "Precio",
                                        type: "number",
                                    }, 
                                ],
                                filterMap: {
                                    "provider": "provider"
                                }
                            }, {
                                type: "formTable",
                                name: "payments",
                                label: "Pagos",
                                fields: [
                                    {
                                        name: "date",
                                        label: "Fecha",
                                        type: "date",
                                    }, {
                                        name: "amount",
                                        label: "Cantidad",
                                        type: "number",
                                    }, {
                                        name: "method",
                                        label: "Forma de pago",
                                        type: "select",
                                        endpoint: "payment_method" 
                                    },
                                ],
                            }
                        ]
                    }
                }
            }
        }, {
            name: "order-work",
            modal: {
                title: 'Orden de compra a trabajo',
                size: 'xl',
                buttons: [
                    {
                        name: "do-order-work",
                        text: "Crear",
                        variant: "primary",
                        method: "POST",
                        onClick: null,
                    }
                ],
                content: {
                    type: "form",
                    config: {}
                }
            }
        }, {
            name: "work-edit",
            modal: {
                title: 'Editar hoja de trabajo',
                size: 'xl',
                buttons: [
                    {
                        name: "do-work-edit",
                        text: "Guardar",
                        variant: "primary",
                        method: "PUT",
                        onClick: doWorkREST,
                    }
                ],
                content: {
                    type: "form",
                    config: {
                        fields: [
                            {
                                type: "datetime",
                                name: "created_at",
                                label: "Fecha",
                            }, {
                                type: "text",
                                name: "number",
                                label: "Folio",
                            }, {
                                type: "text",
                                name: "unit",
                                label: "Unidad",
                            }, {
                                type: "text",
                                name: "model",
                                label: "Modelo",
                            }, {
                                type: "select",
                                name: "taxpayer_id",
                                label: "RFC",
                                endpoint: "taxpayer"
                            }, {
                                type: "text",
                                name: "invoice_number",
                                label: "Numero de factura",
                            }, {
                                type: "date",
                                name: "invoice_date",
                                label: "Fecha de factura",
                            }, {
                                type: "checkbox",
                                name: "authorized",
                                label: "Autorizado"
                            }, {
                                type: "checkbox",
                                name: "include_iva",
                                label: "Incluir IVA"
                            }, {
                                type: "checkbox",
                                name: "requires_invoice",
                                label: "Requiere factura"
                            }, {
                                type: "checkbox",
                                name: "has_credit",
                                label: "Credito"
                            }, {
                                type: "number",
                                name: "discount",
                                label: "Descuento",
                                step: 0.01
                            }, {
                                type: "text",
                                name: "comment",
                                label: "Observaciones",
                            }, {
                                type: "multichoice",
                                name: "work_employees",
                                label: "Trabajadores",
                                endpoint: "employee",
                                formatter: multichoiceEmployeeFormatter,
                                fields: [],
                            }
                        ]
                    }
                }
            }
        }, {
            name: "work_products",
            modal: {
                title: 'Editar productos de hoja de trabajo',
                size: 'xl',
                buttons: [
                    {
                        name: "do-work_products",
                        text: "Guardar",
                        variant: "primary",
                        method: "PUT",
                        onClick: doWorkREST,
                    }
                ],
                content: {
                    type: "form",
                    config: {
                        fields: [
                            {
                                type: "formTable",
                                name: "work_unregisteredproducts",
                                label: "Productos no registrados",
                                fields: [
                                    {
                                        name: "amount",
                                        label: "Cantidad",
                                        type: "number",
                                        defaultValue: 1
                                    }, {
                                        name: "code",
                                        label: "Codigo",
                                        type: "text",
                                    }, {
                                        name: "description",
                                        label: "Descripcion",
                                        type: "text",
                                    }, {
                                        name: "price",
                                        label: "Precio Unitario",
                                        type: "number",
                                    }, 
                                ],
                            }, {
                                type: "multichoice",
                                name: "work_customer_products",
                                label: "Productos en lista de precios",
                                endpoint: "customer",
                                subfield: "customer_products",
                                formatter: multichoiceProductFormatter,
                                fields: [
                                    {
                                        name: "amount",
                                        label: "Cantidad",
                                        type: "number",
                                    }, {
                                        name: "price",
                                        label: "Precio",
                                        type: "number",
                                    }, 
                                ],
                                filterMap: {
                                    "customer": "customer"
                                }
                            }, {
                                type: "multichoice",
                                name: "work_products",
                                label: "Otros productos registrados",
                                endpoint: "product",
                                formatter: multichoiceOtherProductFormatter,
                                fields: [
                                    {
                                        name: "amount",
                                        label: "Cantidad",
                                        type: "number",
                                    }, {
                                        name: "price",
                                        label: "Precio",
                                        type: "number",
                                    }, 
                                ]
                            }, {
                                type: "formTable",
                                name: "payments",
                                label: "Pagos",
                                fields: [
                                    {
                                        name: "date",
                                        label: "Fecha",
                                        type: "date",
                                    }, {
                                        name: "amount",
                                        label: "Cantidad",
                                        type: "number",
                                    }, {
                                        name: "method",
                                        label: "Forma de pago",
                                        type: "select",
                                        endpoint: "payment_method" 
                                    },
                                ],
                            },
                        ]
                    }
                }
            }
        }, {
            name: "work-order",
            modal: {
                title: 'Trabajo a orden de compra',
                size: 'xl',
                buttons: [
                    {
                        name: "do-work-order",
                        text: "Crear",
                        variant: "primary",
                        method: "POST",
                        onClick: doWorkOrder,
                    }
                ],
                content: {
                    type: "form",
                    config: {}
                }
            }
        },
    ],
    sheet: {
        singleFields: [{
            field: 'number',
            title: 'Folio',
        }, {
            field: 'created_at',
            title: 'Fecha',
            formatter: dateTimeFormatter,
        }, {
            field: 'customer.name',
            title: 'Cliente',
        }, {
            field: 'organization.name',
            title: 'Organizacion',
        }, {
            field: 'total',
            title: 'Total',
            formatter: priceFormatter
        }],
        detailFormatter: detailSheetFormatter,
    }
}

export default workbuys;