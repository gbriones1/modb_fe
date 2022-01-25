import { clickEdit, doREST, defaultDeleteSingleModal, defaultMultiDeleteModal } from "../tableUtils";

let products = JSON.parse(localStorage.getItem("product_ids") || "{}");

function multichoiceProductFormatter(data){
    return data.code +" - "+ data.name + " - " + data.description
}

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
                    name: "for_quotation",
                    label: "Para cotizaciones",
                    type: "checkbox"
                }
            ],
        },
        {
            type: "multichoice",
            name: "customer_products",
            label: "Productos",
            endpoint: "product",
            formatter: multichoiceProductFormatter,
            fields: [
                {
                    name: "code",
                    label: "Codigo",
                    type: "text",
                }, {
                    name: "price",
                    label: "Precio",
                    type: "number",
                }, 
            ],
        },
    ]
}

function detailViewFormatter(index, row, element){
    if (Object.keys(row).length !== 0){
        var table = '<br><h4>Productos</h4><table class="table table-sm table-hover"><tr><th>Codigo Cliente</th><th>Codigo Interno</th><th>Descripcion</th><th>Precio</th></tr><tbody>'
        for (let cp of row.customer_products){
            var p = products[cp.product.id]
            table += '<tr><td>'+cp.code+'</td><td>'+p.code+'</td><td>'+p.name+" - "+p.description+'</td><td>$'+cp.price.toFixed(2)+'</td></tr>'
        }
        table += '</tbody><tfoot></tfoot></table>'
        return table
    }
    return ""
}

const customers = {
    name: "Clientes",
    endpoint: "/customer",
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
            field: 'products_amount',
            title: 'Cantidad de productos',
            sortable: true,
            filterControl: 'input'
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

export default customers;