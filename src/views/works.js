import { clickView, boolFormatter, dateTimeFormatter, defaultDeleteSingleModal, defaultMultiDeleteModal, priceFormatter, doREST, clickEdit, listFormatter, doPrint } from "../tableUtils";

let products = JSON.parse(localStorage.getItem("product_ids") || "{}");

function multichoiceProductFormatter(data){
    return data.code +" - "+ data.name + " - " + data.description
}

function multichoiceEmployeeFormatter(data){
    return data.name
}

const baseFormConfig = {
    fields: [
        {
            type: "hidden",
            name: "provider",
        }, {
            type: "text",
            name: "number",
            label: "Folio",
        }, {
            type: "select",
            name: "customer_id",
            label: "Cliente",
            endpoint: "customer"
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
            type: "select",
            name: "organization_id",
            label: "Organizacion",
            endpoint: "organization"
        }, {
            type: "number",
            name: "workbuy_id",
            label: "Numero de hoja de gasto",
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
            name: "work_unregisteredproducts",
            label: "Productos no registrados",
            fields: [
                {
                    name: "amount",
                    label: "Cantidad",
                    type: "number",
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
            name: "work_products",
            label: "Productos registrados",
            endpoint: "product",
            // subfield: "products",
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
            // filterMap: {
            //     "provider": "provider"
            // }
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

function productsRenderer(row){
    if (row && Object.keys(row).length !== 0){
        var table = '<br><h4>Productos</h4><table class="table table-sm table-hover"><tr><th>Cantidad</th><th>Codigo</th><th>Descripcion</th><th>Precio Unitario</th><th>Total</th></tr><tbody>'
        for (let up of row.work_unregisteredproducts){
            table += '<tr><td>'+up.amount+'</td><td>'+up.code+'</td><td>'+up.description+'</td><td>$'+up.price.toFixed(2)+'</td><td>$'+(up.price*up.amount).toFixed(2)+'</td></tr>'
        }
        for (let op of row.work_products){
            var p = products[op.product.id]
            table += '<tr><td>'+op.amount+'</td><td>'+p.code+'</td><td>'+p.name+" - "+p.description+'</td><td>$'+op.price.toFixed(2)+'</td><td>$'+(op.price*op.amount).toFixed(2)+'</td></tr>'
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

function detailViewFormatter(index, row, element){
    if (Object.keys(row).length !== 0){
        return productsRenderer(row)
    }
    return ""
}

function workbuyIDFormatter(value, row, index, field){
    if (value){
        return row.organization.prefix+value
    }
    return null
}

function employeesListFormatter(value, row, index, field){
    var result = []
    if (value) {
        for (let we of value){
            result.push(we.employee.name)
        }
    }
    return result.join(" / ")
}

var works = {
    name: "Hojas de Trabajo",
    endpoint: "/work",
    daterange_filters: true,
    table: {
        properties: {
            filterControl: true,
            pagination: true,
            search: true,
            detailView: true,
            detailFormatter: detailViewFormatter,
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
            filterControl: 'input'
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
            field: 'unit',
            title: 'Unidad',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'model',
            title: 'Modelo',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'taxpayer.name',
            title: 'RFC',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'organization.name',
            title: 'Organizacion',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'work_employees',
            title: 'Trabajadores',
            sortable: true,
            filterControl: 'input',
            formatter: listFormatter
        }, {
            field: 'workbuy_id',
            title: 'Hoja de Gasto',
            sortable: true,
            filterControl: 'input',
            formatter: workbuyIDFormatter,
        }, {
            field: 'invoice_number',
            title: 'Factura',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'authorized',
            title: 'Autorizado',
            sortable: true,
            formatter: boolFormatter,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'total',
            title: 'Total',
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
                    title: 'Gasto de Trabajo',
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
            defaultDeleteSingleModal
        ],
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
        defaultMultiDeleteModal
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
            title: 'Proveedor',
        }, {
            field: 'unit',
            title: 'Unidad',
        }, {
            field: 'model',
            title: 'Modelo',
        }, {
            field: 'work_employees',
            title: 'Trabajadores',
            formatter: employeesListFormatter
        }, {
            field: 'taxpayer.name',
            title: 'RFC',
        }, {
            field: 'comment',
            title: 'Observaciones',
        }, {
            field: 'total',
            title: 'Total',
        }],
        detailFormatter: productsRenderer,
    }
}


export default works;