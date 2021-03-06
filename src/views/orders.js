import { clickView, boolFormatter, dateTimeFormatter, defaultDeleteSingleModal, defaultMultiDeleteModal, priceFormatter, doREST, clickEdit, doPrint } from "../tableUtils";

const $ = require('jquery');

$(document).on('change', 'input.custom-price-input', function(){
    let perc = $(this).val()/100.0
    $(this).closest('table').find('td.custom-price').each(function(){
        let val = $(this).data().value
        $(this).text("$"+(val+(val*perc)).toFixed(2))
    })
})

let products = JSON.parse(localStorage.getItem("product_ids") || "{}");
let provider_products = JSON.parse(localStorage.getItem("provider_products_ids") || "{}")
let percentages = JSON.parse(localStorage.getItem("percentage") || "[]")

let payment_methods = [
    {
        id: "c",
        name: "Efectivo"
    }, {
        id: "t",
        name: "Transferencia"
    }, {
        id: "k",
        name: "Cheque"
    }, {
        id: "d",
        name: "Tarjeta"
    }, {
        id: "r",
        name: "Credito"
    }, {
        id: "w",
        name: "Garantia"
    }
]

localStorage.setItem("payment_method", JSON.stringify(payment_methods))
let pm_ids = {}
for (let pm of payment_methods){
    pm_ids[pm.id] = pm
}
localStorage.setItem("payment_method_ids", JSON.stringify(pm_ids))

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


const baseOrderFormConfig = {
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
        }, {
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

function productsRenderer(row){
    if (row && Object.keys(row).length !== 0){
        var table = '<br><h4>Productos</h4><table class="table table-sm table-hover"><thead><tr><th>Cantidad</th><th>Codigo</th><th>Descripcion</th><th>Precio Unitario</th><th>Total</th></tr></thead><tbody>'
        for (let up of row.order_unregisteredproducts){
            table += '<tr><td>'+up.amount+'</td><td>'+up.code+'</td><td>'+up.description+'</td><td>$'+up.price.toFixed(2)+'</td><td>$'+(up.price*up.amount).toFixed(2)+'</td></tr>'
        }
        for (let op of row.order_provider_products){
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
            table += '<tr><td>'+op.amount+'</td><td>'+op.provider_product.code+'</td><td>'+p.name+" - "+p.description+'</td><td>$'+op.price.toFixed(2)+'</td><td>$'+(op.price*op.amount).toFixed(2)+'</td></tr>'
        }
        table += '</tbody><tfoot><tr><th colspan="4" style="text-align:end;">Sub total</th><th>$'+row.subtotal.toFixed(2)+'</th></tr>'
        if (row.discount){
            table += '<tr><th colspan="4" style="text-align:end;">Descuento</th><th>-$'+row.discount.toFixed(2)+'</th></tr>'
        }
        if (row.include_iva) {
            table += '<tr><th colspan="4" style="text-align:end;">IVA</th><th>$'+((row.subtotal-row.discount)*0.16).toFixed(2)+'</th></tr>'
        }
        table += '<tr><th colspan="4" style="text-align:end;">Total</th><th>$'+row.total.toFixed(2)+'</th></tr>'
        table += '</tfoot></table>'
        return table
    }
    return ""
}

function productsRendererInternal(index, row, element){
    if (row && Object.keys(row).length !== 0){
        if (percentages.length === 0){
            percentages = JSON.parse(localStorage.getItem("percentage") || "[]")
        }
        var table = '<div class="card"><div class="card-body">'
        table += '<h4>Productos</h4><table class="table table-sm table-hover"><thead><tr><th>Cantidad</th><th>Codigo</th><th>Descripcion</th><th>Precio Unitario</th><th>Total</th><th>Precio Sugerido de Venta</th><th>Incremento de precio personalizado:<div class="row"><input class="form-control custom-price-input" type="number" style="width:5em;" value="45"/>%</div></th></tr></thead><tbody>'
        for (let up of row.order_unregisteredproducts){
            let suggested = up.price
            for (let sp of percentages){
                if (sp.max_price_limit >= up.price){
                    suggested = up.price + (up.price * (sp.increment/100))
                    break;
                }
            }
            table += '<tr><td>'+up.amount+'</td><td>'+up.code+'</td><td>'+up.description+'</td><td>$'+up.price.toFixed(2)+'</td><td>$'+(up.price*up.amount).toFixed(2)+'</td><td>$'+suggested.toFixed(2)+'</td><td class="custom-price" data-value="'+up.price+'">$'+(up.price+(up.price*0.45)).toFixed(2)+'</td></tr>'
        }
        for (let op of row.order_provider_products){
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
            let suggested = op.price
            for (let sp of percentages){
                if (sp.max_price_limit >= op.price){
                    suggested = op.price + (op.price * (sp.increment/100))
                    break;
                }
            }
            table += '<tr><td>'+op.amount+'</td><td>'+op.provider_product.code+'</td><td>'+p.name+" - "+p.description+'</td><td>$'+op.price.toFixed(2)+'</td><td>$'+(op.price*op.amount).toFixed(2)+'</td><td>$'+suggested.toFixed(2)+'</td></tr>'
        }
        table += '</tbody><tfoot><tr><th colspan="4" style="text-align:end;">Sub total</th><th>$'+row.subtotal.toFixed(2)+'</th></tr>'
        if (row.discount){
            table += '<tr><th colspan="4" style="text-align:end;">Descuento</th><th>-$'+row.discount.toFixed(2)+'</th></tr>'
        }
        if (row.include_iva) {
            table += '<tr><th colspan="4" style="text-align:end;">IVA</th><th>$'+((row.subtotal-row.discount)*0.16).toFixed(2)+'</th></tr>'
        }
        table += '<tr><th colspan="4" style="text-align:end;">Total</th><th>$'+row.total.toFixed(2)+'</th></tr>'
        table += '</tfoot></table>'
        table += '</div></div>'
        table += '<br>'
        table += '<div class="card"><div class="card-body">'
        table += '<h4>Pagos</h4><table class="table table-sm table-hover"><thead><tr><th>Fecha</th><th>Forma de pago</th><th>Cantidad</th></tr></thead><tbody>'
        let totalPay = 0.0;
        for (let p of row.payments){
            totalPay += p.amount
            table += '<tr><td>'+p.date+'</td><td>'+pm_ids[p.method].name+'</td><td>$'+p.amount.toFixed(2)+'</td></tr>'
        }
        table += '</tbody><tfoot><tr><th colspan="2" style="text-align:end;">Total Pagado</th><th>$'+totalPay.toFixed(2)+'</th></tr>'
        table += '<tr><th colspan="2" style="text-align:end;">Restante</th><th>$'+(row.total - totalPay).toFixed(2)+'</th></tr>'
        table += '</tfoot></table>'
        table += '</div></div>'
        return table
    }
    return ""
}

function detailViewFormatter(index, row, element){
    if (Object.keys(row).length !== 0){
        return productsRenderer(row)
    }
    return ""
}

function indexFormatter(value, row, index, field){
    return row.workbuy_number + " - " +(index+1)
}

var orders = {
    name: "Ordenes de compra para trabajos",
    endpoint: "/order",
    buyIds_filters: true,
    table: {
        properties: {
            filterControl: true,
            pagination: true,
            search: true,
            detailView: true,
            showColumns: true,
            showExport: true,
            exportTypes: ['png', 'csv', 'doc', 'excel', 'xlsx', 'pdf'],
            detailFormatter: productsRendererInternal,
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'index',
            title: 'Folio',
            sortable: true,
            filterControl: 'input',
            formatter: indexFormatter,
        }, {
            field: 'created_at',
            title: 'Fecha',
            sortable: true,
            filterControl: 'input',
            formatter: dateTimeFormatter,
        }, {
            field: 'provider.name',
            title: 'Proveedor',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'taxpayer.name',
            title: 'RFC',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'claimant.name',
            title: 'Recolector',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'comment',
            title: 'Observaciones',
            sortable: true,
            filterControl: 'input',
            visible: false,
        }, {
            field: 'invoice_number',
            title: 'Factura',
            sortable: true,
            filterControl: 'input',
            visible: false,
        }, {
            field: 'invoice_date',
            title: 'Fecha de Factura',
            sortable: true,
            filterControl: 'input',
            visible: false,
        }, {
            field: 'authorized',
            title: 'Autorizado',
            sortable: true,
            formatter: boolFormatter,
            align: 'center',
            valign: 'middle',
            visible: false,
        }, {
            field: 'include_iva',
            title: 'Incluye IVA',
            sortable: true,
            formatter: boolFormatter,
            align: 'center',
            valign: 'middle',
            visible: false,
        }, {
            field: 'total',
            title: 'Total',
            sortable: true,
            filterControl: 'input',
            formatter: priceFormatter,
            visible: false,
        }],
        rowActions: [
            {
                name: "view",
                button: {
                    icon: ["far", "eye"],
                    event: clickView,
                },
                modal: {
                    title: 'Orden de compra',
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
                        config: baseOrderFormConfig
                    }
                }
            },
            defaultDeleteSingleModal
        ],
    },
    modalButtons: [
        // {
        //     name: "new",
        //     button: {
        //         icon: ["far", "plus-square"],
        //         variant: "primary",
        //     },
        //     modal: {
        //         title: 'Nuevo',
        //         size: 'xl',
        //         buttons: [
        //             {
        //                 name: "do-new",
        //                 text: "Crear",
        //                 variant: "primary",
        //                 method: "POST",
        //                 onClick: doREST,
        //             }
        //         ],
        //         content: {
        //             type: "form",
        //             config: baseOrderFormConfig
        //         }
        //     }
        // },
        defaultMultiDeleteModal
    ],
    sheet: {
        singleFields: [{
            field: 'workbuy_number',
            title: 'Registro',
        }, {
            field: 'created_at',
            title: 'Fecha',
            formatter: dateTimeFormatter,
        }, {
            field: 'provider.name',
            title: 'Proveedor',
        }, {
            field: 'taxpayer.name',
            title: 'RFC',
        }, {
            field: 'comment',
            title: 'Observaciones',
        }, {
            field: 'total',
            title: 'Total',
            formatter: priceFormatter,
        }],
        detailFormatter: productsRenderer,
    }
}

export default orders;