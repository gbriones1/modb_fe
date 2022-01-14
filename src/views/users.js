import { listFormatter, boolFormatter, clickEdit, clickDelete } from '../tableUtils'

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

        ]
    },
    modals: [
        {
            name: 'edit',
            title: 'Editar',
            size: 'xl',
            buttons: [
                {
                    text: "Guardar",
                    variant: "success"
                }
            ],
            content: {
                type: "form",
                config:{
                    fields: [
                        {
                            type: "text",
                            name: "username",
                            label: "Nombre de usuario"
                        }
                    ]
                }
            }
        }, {
            name: 'delete',
            title: 'Eliminar',
            buttons: [
                {
                    text: "Eliminar",
                    variant: "danger"
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

export default users;