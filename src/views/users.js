import { listFormatter, boolFormatter, clickEdit, defaultDeleteSingleModal, doREST, defaultMultiDeleteModal } from '../tableUtils'

const editFormConfig = {
    fields: [
        {
            type: "checkbox",
            name: "is_admin",
            label: "Administrador"
        },
    ]
}

const newFormConfig = {
    fields: [
        {
            type: "text",
            name: "username",
            label: "Nombre"
        },
        {
            type: "password",
            name: "password",
            label: "Contrasena"
        },
        {
            type: "checkbox",
            name: "is_admin",
            label: "Administrador"
        },
    ]
}

const users = {
    name: "Usuarios",
    endpoint: "/user",
    table: {
        properties: {
            filterControl: true,
            pagination: true,
            search: true,
        },
        columns: [
            {
                field: 'state',
                checkbox: true,
                align: 'center',
                valign: 'middle'
            }, {
                field: 'id',
                title: 'ID'
            }, {
                field: 'username',
                title: 'Nombre de usuario',
                sortable: true,
                filterControl: 'input'
            }, {
                field: 'roles',
                title: 'Permisos',
                formatter: listFormatter,
            }, {
                field: 'is_admin',
                title: 'Administrador',
                align: 'center',
                formatter: boolFormatter,
            }
        ],
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
                        config: editFormConfig
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
                    config: newFormConfig
                }
            }
        },
        defaultMultiDeleteModal
    ],
}

export default users;