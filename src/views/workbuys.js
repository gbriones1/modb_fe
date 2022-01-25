import { clickView, dateTimeFormatter, priceFormatter, defaultDeleteSingleModal, defaultMultiDeleteModal, doREST, clickEdit, boolFormatter, doPrint } from "../tableUtils";
import history from "../history";

const $ = require('jquery');

let products = JSON.parse(localStorage.getItem("product_ids") || "{}");
let provider_products = JSON.parse(localStorage.getItem("provider_products_ids") || "{}")

$(document).on('click', 'button.order-nav', function(){
    // console.log($(this).data());
    history.push("/work_order?workbuy_ids="+$(this).data().id)
})

$(document).on('click', 'button.work-nav', function(){
    // console.log($(this).data());
    history.push("/work?workbuy_ids="+$(this).data().id)
})

$(document).on('click', 'button.custom-view', function(){
    console.log($(this).data());
    let iframe =  $("iframe.view-iframe");
    iframe.attr('src', $(this).data().endpoint+"/"+$(this).data().objectId)
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
                    type: "checkbox",
                }, 
            ],
        }
    ]
}

function detailViewFormatter(index, row, element){
    var table = '<div class="row"><div class="col"><h4>Ordenes de Compra</h4></div><div class="col-md-2"><button type="button" class="btn btn-success order-nav" data-id="'+row.id+'"><i class="far fa-edit" style="width: 14px;"></i></button></div></div>'
    table += '<table  class="table table-sm table-hover"><tr><th>Folio</th><th>Proveedor</th><th>Razon social</th><th>Autorizado</th><th>Total</th><th>Ver</th></tr><tbody>'
    var index_in_workbuy = 0
    for (let o of row.orders){
        index_in_workbuy++
        table += '<tr><td>'+row.number+' - '+index_in_workbuy+'</td><td>'+o.provider.name+'</td><td>'+o.taxpayer.name+'</td><td>'+boolFormatter(o.authorized)+'</td><td>$'+o.total.toFixed(2)+'</td><td><button type="button" class="btn btn-info custom-view" data-endpoint="work_order" data-object-id="'+o.id+'" data-bs-toggle="modal" data-bs-target="#view"><i class="far fa-eye" style="width: 14px;"></i></button></td></tr>'
    }
    table += '</tbody></table>'
    table += '<br />'
    table += '<div class="row"><div class="col"><h4>Hojas de trabajo</h4></div><div class="col-md-2"><button type="button" class="btn btn-success work-nav" data-id="'+row.id+'"><i class="far fa-edit" style="width: 14px;"></i></button></div></div>'
    table += '<table  class="table table-sm table-hover"><tr><th>Numero</th><th>Unidad</th><th>Modelo</th><th>Razon social</th><th>Autorizado</th><th>Total</th><th>Ver</th></tr><tbody>'
    for (let o of row.works){
        table += '<tr><td>'+o.number+'</td><td>'+o.unit+'</td><td>'+o.model+'</td><td>'+o.taxpayer.name+'</td><td>'+boolFormatter(o.authorized)+'</td><td>$'+o.total.toFixed(2)+'</td><td><button type="button" class="btn btn-info custom-view" data-endpoint="work" data-object-id="'+o.id+'" data-bs-toggle="modal" data-bs-target="#view"><i class="far fa-eye" style="width: 14px;"></i></button></td></tr>'
    }
    table += '</tbody></table>'
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
                var p = products[provider_products[op.provider_product.id].product.id]
                table += '<tr><td>'+op.amount+'</td><td>'+p.code+'</td><td>'+p.name+" - "+p.description+'</td><td>$'+op.price+'</td><td>$'+(op.price*op.amount).toFixed(2)+'</td></tr>'
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