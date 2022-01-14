import { clickEdit, doREST, defaultDeleteSingleModal, defaultMultiDeleteModal } from "../tableUtils";

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

const customers = {
    name: "Clientes",
    endpoint: "/customer",
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
            field: 'name',
            title: 'Nombre',
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