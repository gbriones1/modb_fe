import { clickEdit, doREST, defaultDeleteSingleModal, defaultMultiDeleteModal } from "../tableUtils";

let products = JSON.parse(localStorage.getItem("product_ids") || "{}");

const baseFormConfig = {
    fields: [
        {
            type: "text",
            name: "name",
            label: "Nombre"
        },
        {
            type: "formTable",
            name: "contacts",
            label: "Contactos",
            fields: [
                {
                    name: "name",
                    label: "Nombre",
                    type: "text"
                }, {
                    name: "department",
                    label: "Departamento",
                    type: "text"
                }, {
                    name: "email",
                    label: "Email",
                    type: "text"
                }, {
                    name: "phone",
                    label: "Telefono",
                    type: "text"
                }, {
                    name: "for_orders",
                    label: "Para pedidos",
                    type: "checkbox"
                }
            ],
        }
    ]
}

function detailViewFormatter(index, row, element){
    if (Object.keys(row).length !== 0){
        var table = '<br><h4>Productos</h4><table class="table table-sm table-hover"><tr><th>Codigo</th><th>Descripcion</th><th>Precio</th><th>Descuento</th></tr><tbody>'
        for (let pp of row.provider_products){
            var p = products[pp.product]
            table += '<tr><td>'+p.code+'</td><td>'+p.name+" - "+p.description+'</td><td>$'+pp.price.toFixed(2)+'</td><td>$'+pp.discount.toFixed(2)+'</td></tr>'
        }
        table += '</tbody><tfoot></tfoot></table>'
        return table
    }
    return ""
}

function ppLengthFormatter(value, row, index, field){
    return row.provider_products.length
}
const providers = {
    name: "Proveedores",
    endpoint: "/provider",
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
            field: 'name',
            title: 'Nombre',
            sortable: true,
            filterControl: 'input'
        }, {
            field: 'provider_products_length',
            title: 'Cantidad de productos',
            sortable: true,
            filterControl: 'input',
            formatter: ppLengthFormatter
        }],
        rowActions: [
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
}

export default providers;