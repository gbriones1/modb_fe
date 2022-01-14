import { clickEdit, clickDelete, doREST, doFormTableUpdate, dateTimeFormatter, boolFormatter } from "../tableUtils";

let baseFormConfig = {
    fields: [
        {
            type: "date",
            name: "date",
            label: "Fecha",
        }, {
            type: "select",
            name: "provider",
            label: "Proveedor",
            endpoint: "provider"
        }, {
            type: "text",
            name: "number",
            label: "Numero",
        }, {
            type: "text",
            name: "uuid",
            label: "Folio",
        }, {
            type: "number",
            name: "price",
            label: "Precio",
        }, {
            type: "date",
            name: "due",
            label: "Vence",
        }, {
            type: "formTable",
            name: "payments",
            label: "Pagos",
            fields: [
                {
                    name: "date",
                    label: "Fecha",
                    type: "date"
                }, {
                    name: "amount",
                    label: "Monto",
                    type: "number",
                }, {
                    name: "method",
                    label: "Forma de pago",
                    type: "text",
                }
            ],
            buttons: [
                {
                    text: "Agregar",
                    variant: "primary",
                    onClick: doFormTableUpdate,
                }
            ],
            onClick: () => console.log("Hi")
        }
    ]
}

function dataProcessor (data){
    for (let x of data){
        let providers = JSON.parse(localStorage.getItem("provider_ids") || "{}");
        x.provider_name = Object.keys(providers).length > 0 && x.provider ? providers[x.provider].name : x.provider
    }
    return data
}

const buyinvoices = {
    name: "Facturas de compras",
    endpoint: "/buyinvoice",
    daterange_filters: true,
    table: {
        properties: {
            filterControl: true,
            pagination: true,
            search: true,
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'number',
            title: 'Numero',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'uuid',
            title: 'Folio',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'date',
            title: 'Fecha',
            sortable: true,
            filterControl: 'input',
            formatter: dateTimeFormatter,
        }, {
            field: 'due',
            title: 'Vencimiento',
            sortable: true,
            filterControl: 'input',
            formatter: dateTimeFormatter,
        }, {
            field: 'provider_name',
            title: 'Cliente',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'price',
            title: 'Precio',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'paid',
            title: 'Pagado',
            sortable: true,
            formatter: boolFormatter,
        }],
        rowActions: [
            {
                name: "edit",
                icon: ["far", "edit"],
                event: clickEdit
            },
            {
                name: "delete",
                icon: ["far", "trash-alt"],
                event: clickDelete
            }
        ],
        tableActions: [
            {
                name: "new",
                icon: ["far", "plus-square"],
                variant: "primary",
            },
            {
                name: "multi-delete",
                icon: ["far", "trash-alt"],
                variant: "danger"
            }
        ],
        dataProcessor: dataProcessor,
    },
    modals: [
        {
            name: 'new',
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
                config: baseFormConfig,
            }
        },
        {
            name: 'edit',
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
                config: baseFormConfig,
            }
        }, {
            name: 'delete',
            title: 'Eliminar',
            buttons: [
                {
                    name: "do-delete",
                    text: "Eliminar",
                    variant: "danger",
                    method: "DELETE",
                    onClick: doREST,
                }
            ],
            content: {
                type: "message",
                config: {
                    text: "Seguro que desea eliminar el objeto?"
                }
            }
        }
    ]
}

export default buyinvoices;