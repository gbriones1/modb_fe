import history from "./history";

import config from "./config";

import jQuery from "jquery";

const $ = require('jquery');

const cachableEndpoints = [
    "provider",
    "customer",
    "employee",
    "brand",
    "appliance",
    "product",
    "organization",
    "taxpayer",
    "storage",
    "storagetype"
]

const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic"
]

const defaultNewModal = {
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
        }
    }
}

const defaultMultiDeleteModal = {
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

const defaultEditModal = {
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
        }
    }
}

const defaultDeleteSingleModal = {
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

function cacheData(endpoint, data){
    if (cachableEndpoints.includes(endpoint)){
        console.log("Caching "+endpoint)
        localStorage.setItem(endpoint, JSON.stringify(data));
        let byId = {}
        var ppIds = {};
        var prices = {};
        for (let x of data){
            byId[x.id] = x
            if (endpoint === "provider"){
                for (let pp of x.provider_products){
                    ppIds[pp.id] = pp;
                    if (!(pp.product in prices)){
                        prices[pp.product] = []
                    }
                    prices[pp.product].push({
                        provider: x.id,
                        price: pp.price,
                        discount: pp.discount
                    })
                }
            }
        }
        localStorage.setItem(endpoint+"_ids", JSON.stringify(byId));
        if (endpoint === "provider"){
            localStorage.setItem("provider_products_ids", JSON.stringify(ppIds));
            localStorage.setItem("product_prices_ids", JSON.stringify(prices));
        }
    }
}

(function ($) {
    $.fn.serializeFormJSON = function () {
        let form = this;
        var data = form.serializeObject();
        return JSON.stringify(data);
    };
})(jQuery);

(function ($) {
    $.fn.serializeObject = function () {
        let result = {};
        let form = $(this)
        form.find("input").each(function() {
            let value = $(this).val();
            if ($(this).attr("type") === "checkbox"){
                value = $(this).prop('checked');
            }
            else if ($(this).attr("type") === "number"){
                value = value || 0
            }
            else if ($(this).attr("type") === "date"){
                value = value || null
            }
            else if ($(this).attr("type") === "hidden"){
                if ($(this).data().type === "form-table"){
                    value = JSON.parse(value || "[]");
                }
                else if ($(this).data().type === "multichoice"){
                    value = JSON.parse(value || "[]");
                }
            }
            result[$(this).attr("name")] = value;
        });
        form.find("select").each(function(){
            result[$(this).attr("name")] = parseInt($(this).val()) || null;
        });
        return result
    };
})(jQuery);

JSON.flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
      if (Object(cur) !== cur) {
          result[prop] = cur;
      } else if (Array.isArray(cur)) {
           for(var i=0, l=cur.length; i<l; i++)
               recurse(cur[i], prop + "[" + i + "]");
          if (l === 0)
              result[prop] = [];
          } else {
              var isEmpty = true;
              for (var p in cur) {
                  isEmpty = false;
                  recurse(cur[p], prop ? prop+"."+p : p);
              }
              if (isEmpty && prop)
                  result[prop] = {};
          }
      }
      recurse(data, "");
      return result;
}

function dateTimeFormatter(value, row, index, field){
    if (value) {
        let date = new Date(Date.parse(value))
        return ""+date.getDate()+"/"+monthNames[date.getMonth()]+"/"+date.getFullYear()+" - "+String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0')
    }
    return ""
}

function priceFormatter(value, row, index, field){
    if (value){
        return "$"+value.toFixed(2)
    }
    return  ""
}

function listFormatter(value, row, index, field){
    var result = '<ul class="list-group">';
    for (var x of value){
        result += '<li class="list-group-item">'+arrayFieldFormatter[field](x)+'</li>';
    }
    result += '</ul>';
    return result;
}

function fetchIDNameFormatter(value, row, index, field){
    if (field && value){
        let data = {};
        let cached = localStorage.getItem(field+"_ids");
        if (cached){
            data = JSON.parse(cached);
        }
        if (Object.keys(data).length !== 0){
            return data[value].name
        }
    }
    return ''
}

function boolFormatter(value, row, index, field){
    if (value){
        return '<i class="far fa-check-circle"></i>'
    }
    return '<i class="far fa-times-circle"></i>'
}

function showDetailFormatter(value, row, index, field){
    return '<a class="detail-icon" href="#"><i class="fa fa-plus"></i></a><div style="display: none;">'+value+"</div>"
}

function debugFormatter(value, row, index, field){
    console.log(value)
    console.log(row)
    console.log(index)
    console.log(field)
    return 'Debug'
}

function clickEdit (e, fieldValue, data, index) {
    let modal =  $(".modal#edit");
    let form = modal.find("form");
    form[0].reset();
    form.trigger("reset");
    modal.attr('obj-id', data.id);
    form.find('select').each(function (){
        $(this).val("");
    });
    for (var key in data){
        var value = data[key];
        if (key === "date"){
            if (value.length === 10){
                value += " 00:00"
            }
            var d = new Date(value);
            if (form.find('input[name="'+ key +'"]').attr('type') === "datetime-local"){
                value = d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)+"T"+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2);
            }
            else{
                value = d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);
            }
        } else if (typeof(data[key]) == "object"){
            if (data[key]){
                value = JSON.stringify(data[key]);
                if (!Array.isArray(data[key])){
                    form.find('select[name="'+ key +'_id"]').val(data[key]["id"]);
                }
                // if (Array.isArray(data[key])){
                //     value = JSON.stringify(data[key]);
                // } else {
                //     value = JSON.stringify(data[key]["id"])
                // }
                // try {
                //     if (Array.isArray(data[key])){
                //         value = arrayFieldFormatter[key](data[key])
                //     }
                //     value = objectFieldFormatter[key](data[key])
                // } catch {
                //     value = JSON.stringify(data[key]);
                // }
            }
            else{
                value = ""
            }
        }
        form.find('input[name="'+ key +'"]').val(value);
        var field = form.find('input[name="'+ key +'"]');
        if (field.data('type') === 'form-table'){
            formTableUpdate(form, key, JSON.parse(value))
        }
        if (field.data('type') === 'multichoice'){
            multiChoiceUpdate(form, key, JSON.parse(value), data)
        }
        if (field.attr("type") === "checkbox"){
            if (value === "Si" || value === "True" || value === true){
                field.prop('checked', true);
            }else {
                field.prop('checked', false);
            }
        }
        // var selected = ''
        // if ("id" in data){
        //     // eslint-disable-next-line
        //     form.find('select[name="'+ key +'_id"] option').each(function (){
        //         if (parseInt($(this).val()) === data[key]){
        //             selected = $(this).val()
        //         }
        //     });
        // } else {
            // eslint-disable-next-line
            // form.find('select[name="'+ key +'_id"] option').each(function (){
            //     if (parseInt($(this).val()) === data[key]["id"]){
            //         selected = $(this).val()
            //     }
            // });
        // }
        // form.find('select[name="'+ key +'_id"]').val(selected);
        form.find('input[type="checkbox"]').each(function () {
            $(this).val(true)
        });
    }
}

function clickDelete (e, value, data, index) {
    let modal = $(".modal#delete");
    modal.attr('obj-id', data.id);
}

function clickView (e, value, data, index){
    let iframe =  $("iframe.view-iframe");
    iframe.attr('src', window.location.pathname+"/"+data.id)
    // history.push(window.location.pathname+"/"+data.id);
}

function doREST (endpoint, method, modalName, btnName, successHook, setNotifications) {
    let url = config.apiURL+endpoint;
    let token = localStorage.getItem('token');
    let modal = $(".modal#"+modalName)
    let form = modal.find("form");
    let button = modal.find("button."+btnName);
    button.attr('disabled', true)
    if (method === "PUT" || method === "DELETE"){
        url += "/"+modal.attr("obj-id");
    }
    let ajax_config = {
        url: url,
        type: method,
        headers: {Authorization: "Bearer "+token},
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
            button.attr('disabled', false)
            modal.find('[aria-label="Close"]').trigger({type: "click"})
            let name = endpoint.substring(1);
            if (cachableEndpoints.includes(name)){
                console.log("cleaning cache for "+name)
                localStorage.removeItem(name);
                localStorage.removeItem(name+"_ids");
            }
            successHook();
        },
        error: function (data) {
            if (data.status === 401){
                localStorage.removeItem('token');
                window.location.reload();
            }
            button.attr('disabled', false)
            // setNotifications([{text: JSON.stringify(data.responseJSON), title:"Error", variant:"danger"}])
            console.log(data.responseJSON)
        }
    };
    if (method === "POST" || method === "PUT"){
        ajax_config.data = form.serializeFormJSON()
        console.log("Sending data")
        console.log(JSON.parse(ajax_config.data));
    }
    $.ajax(ajax_config);
    console.log("REST call sent")
}

function doFormTableUpdate (url, method, modalName, btnName, successHook){
    let modal = $(".modal#"+modalName);
    let form = modal.find("form");
    let [fieldName, parentFormName] = modalName.split("-")
    let parentForm = $(".modal#"+parentFormName+" form");
    let data = parentForm.serializeObject()[fieldName];
    data.push(form.serializeObject());
    formTableUpdate(parentForm, fieldName, data);
    // modal.find('[data-bs-dismiss="modal"]').trigger({type: "click"})
    form[0].reset();
    form.trigger("reset");
    form.find('select').each(function (){
        $(this).val("");
    });
}

function doPrint(url, method, modalName, btnName, successHook){
    let modal = $(".modal#"+modalName);
    let iframe = modal.find("iframe");
    iframe[0].contentWindow.print();
}

function formTableUpdate (form, fieldName, data){
    var field = form.find('[name="'+fieldName+'"]');
    var table = field.closest('div.row').find("table");
    var headers = table.find("thead tr");
    var tbody = table.find("tbody");
    tbody.empty()
    var index = 0;
    for (var subData of data){
        var tr = $('<tr>')
        // eslint-disable-next-line
        headers.children().each(function () {
            var columnDef = $(this).data();
            if (columnDef.field){
                var style = "";
                var text = subData[columnDef.field];
                if (columnDef.type === "checkbox"){
                    style += 'text-align: center; '
                    if (text){
                        text = '<i class="far fa-check-circle"></i>';
                    } else {
                        text = '<i class="far fa-times-circle"></i>';
                    }
                }
                if (text === null){
                    text = ""
                }
                else {
                    if (columnDef.type === "select"){
                        text = ""
                        if ("id" in subData){
                            text = (subData[columnDef.field.replace("_id", "")] || {name:""}).name
                        } else {
                            let cached = JSON.parse(localStorage.getItem(columnDef.config.endpoint+"_ids"));
                            text = cached[subData[columnDef.field]].name
                        }
                    }
                }
                tr.append('<td style="'+style+'">'+text+'</td>');
            }
        });
        tr.append('<td><button type="buttton" class="btn btn-sm btn-danger formTable-remove" data-index="'+index+'"><i class="far fa-trash-alt"></i></button></td>');
        index++;
        tbody.append(tr);
    }
    field.val(JSON.stringify(data))
}

function multiChoiceFilter(available, filters){
    available.children().each(function(){
        let data = JSON.parse($(this).attr("data"))
        $(this).show();
        $(this).addClass('searchable')
        for (var filter in filters){
            if (data[filter] !== filters[filter]){
                $(this).removeClass('searchable')
                $(this).hide();
            }
        }
    })
}

function multiChoiceSearch(listed, value){
    listed.children().each(function() {
        var option = $(this)
        if (option.hasClass('searchable')){
            if (option.text().match(new RegExp(value, "i"))){
                option.show();
            } else {
                option.hide();
            }
        }
    })
}

function multiChoiceAddOpt(option, data = {}){
    let multichoice = option.closest('.multiChoice');
    let field = multichoice.find('input[data-type="multichoice"]');
    var subFields = JSON.parse(field.attr("data-fields") || "[]");
    let added = multichoice.find(".list-group.added");
    let optionData = JSON.parse(option.attr("data"));
    let optionAdded = added.find('li[data-id="'+option.data().id+'"]');
    if (optionAdded.length > 0){
        var amountInput = optionAdded.find('input[name="amount"]');
        amountInput.val(parseInt(amountInput.val())+1);
    } else {
        var li = $('<li class="list-group-item" data-id="'+option.data().id+'">');
        li.text(option.text());
        li.append('<button class="btn btn-sm btn-danger remove-btn"><i class="far fa-trash-alt"></i></button>');
        var fieldsRow = $('<div class="row">');
        for (var subField of subFields){
            var value = data[subField.name] || null
            if (value === null){
                if (subField.name === 'amount'){
                    value = 1;
                }
                else {
                    value = optionData[subField.name] || null;
                }
            }
            value = value === null ? (subField.type === "number" ? 0 : '') : value;
            fieldsRow.append('<label class="form-label col-form-label col-sm-2">'+subField.label+'</label><div class="col-sm-4"><input name="'+subField.name+'" type="'+subField.type+'" class="form-control" value="'+value+'"></div>')
        }
        li.append(fieldsRow);
        added.append(li);
    }
    multiChoiceValRefresh(multichoice)
}

function multiChoiceValRefresh(multichoice){
    var items = [];
    let field = multichoice.find('input[data-type="multichoice"]');
    var subfield = field.attr("data-subfield");
    var subFields = JSON.parse(field.attr("data-fields") || "[]");
    multichoice.find(".list-group.added li.list-group-item").each(function() {
        var item = {}
        item[subfield+"_id"] = $(this).data("id")
        for (var subField of subFields){
            item[subField.name] = $(this).find('input[name="'+subField.name+'"]').val()
            if (subField.type === "number") {
                item[subField.name] = parseFloat(item[subField.name])
            }
        }
        items.push(item);
    });
    field.val(JSON.stringify(items));
}

function multiChoiceUpdate(form, fieldName, data, parentData){
    var field = form.find('[name="'+fieldName+'"]');
    var endpoint = field.attr("data-endpoint");
    var subfield = field.attr("data-subfield");
    var available = field.closest('div.row').find(".list-group.available");
    var added = field.closest('div.row').find(".list-group.added");
    if (endpoint !== subfield){
        // var filterMap = JSON.parse(field.attr("data-filter-map") || "{}");
        var filters = {};
        filters[endpoint] = parentData[endpoint]["id"];
        // for (var filter in filterMap){
        //     filters[filterMap[filter]] = parentData[filter];
        // }
        multiChoiceFilter(available, filters);
    }
    added.empty();
    for (var subData of data){
        var option = available.find('[data-id="'+subData[subfield].id+'"]');
        multiChoiceAddOpt(option, subData);
    }
}

$(document).on('click', '.multiChoice .available button.list-group-item', function(){
    multiChoiceAddOpt($(this));
});

$(document).on('click', '.multiChoice .added button.remove-btn', function(){
    $(this).closest('li').remove();
});

$(document).on('keyup change', '.multiChoice input.search-available', function(){
    var value = $(this).val();
    var list = $(this).closest('.multiChoice').find('.available');
    multiChoiceSearch(list, value);
});

$(document).on('keyup change', '.multiChoice .added li.list-group-item input', function(){
    multiChoiceValRefresh($(this).closest('.multiChoice'));
});


const arrayFieldFormatter = {
    'roles': (item) => item.name,
    'contacts': (item) => item.name,
    'work_employees': (item) => item.employee.name,
}

// const objectFieldFormatter = {
//     'brand': (item) => item.name,
//     'provider': (item) => item.name,
//     'appliance': (item) => item.name,
// }

function nameListGetter(data) {
    return data.map(x => x.name)
}

$(document).on('click', '.formTable-remove', function(){
    let index = $(this).data().index;
    let field = $(this).closest(".formTable").find('input');
    let data = JSON.parse(field.val());
    let fieldName = field.attr("name");
    data.splice(index, 1);
    formTableUpdate($(this).closest("form"), fieldName, data);
})

$(document).on('click', 'button[data-bs-toggle="dropdown"]', function(){
    let menu = $(this).closest('div').find('.dropdown-menu')
    menu.toggleClass('show')
})

export { defaultNewModal, defaultEditModal, defaultMultiDeleteModal, defaultDeleteSingleModal, cachableEndpoints, nameListGetter, dateTimeFormatter, priceFormatter, listFormatter, fetchIDNameFormatter, boolFormatter, showDetailFormatter, debugFormatter, clickEdit, clickDelete, clickView, doREST, doFormTableUpdate, doPrint, cacheData }