import { clickEdit, clickDelete, nameListGetter, doREST } from "../tableUtils";

let product_prices = JSON.parse(localStorage.getItem("product_prices_ids") || "{}");
let providers = JSON.parse(localStorage.getItem("provider_ids") || "{}");

const baseFormConfig = {
    fields: [
        {
            type: "text",
            name: "code",
            label: "Codigo"
        }, {
            type: "datalist",
            name: "brand",
            label: "Marca",
            optSrc: "/brand",
            postprocessor: nameListGetter,
        }, {
            type: "text",
            name: "name",
            label: "Nombre"
        }, {
            type: "text",
            name: "description",
            label: "Descripcion"
        }, {
            type: "datalist",
            name: "appliance",
            label: "Aplicacion",
            optSrc: "/appliance",
            postprocessor: nameListGetter,
        },
    ]
}

function productPricesFormatter(value, row, index, field){
    var result = "";
    if (product_prices[row.id]){
        result += '<ul class="list-group">';
        for (let pp of product_prices[row.id]){
            result += '<li class="list-group-item">'+providers[pp.provider].name+': $'+(pp.price-pp.discount).toFixed(2)+'</li>';
        }
        result += '</ul>';
    }
    return result;
}

const products = {
    name: "Productos",
    endpoint: "/product",
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
            field: 'code',
            title: 'Codigo',
            sortable: true,
            filterControl: 'input'
        }, {
            field: 'brand.name',
            title: 'Marca',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'name',
            title: 'Producto',
            sortable: true,
            filterControl: 'input'
        }, {
            field: 'description',
            title: 'Descripcion',
            sortable: true,
            filterControl: 'input'
        }, {
            field: 'appliance.name',
            title: 'Aplicacion',
            sortable: true,
            filterControl: 'input',
        }, {
            field: 'providers_price',
            title: 'Precios',
            formatter: productPricesFormatter
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
                        config: baseFormConfig,
                    }
                }
            }, {
                name: "delete",
                button: {
                    name: "delete",
                    icon: ["far", "trash-alt"],
                    event: clickDelete
                },
                modal: {
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
            }
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
                    config: baseFormConfig,
                }
            }
        },
        {
            name: "multi-delete",
            button: {
                icon: ["far", "trash-alt"],
                variant: "danger"
            },
            modal: {
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
                        text: "Seguro que desea eliminar los objetos seleccionados?"
                    }
                }
            }
        }
    ],
}

export default products;