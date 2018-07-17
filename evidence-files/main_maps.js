var EasyAutocomplete = (function(scope) {
    scope.Configuration = function Configuration(options) {
        var defaults = {
            data: "list-required",
            url: "list-required",
            dataType: "json",
            listLocation: function(data) {
                return data;
            },
            xmlElementName: "",
            getValue: function(element) {
                return element;
            },
            autocompleteOff: true,
            placeholder: false,
            ajaxCallback: function() {},
            matchResponseProperty: false,
            list: {
                sort: {
                    enabled: false,
                    method: function(a, b) {
                        a = defaults.getValue(a);
                        b = defaults.getValue(b);
                        if (a < b) {
                            return -1;
                        }
                        if (a > b) {
                            return 1;
                        }
                        return 0;
                    }
                },
                maxNumberOfElements: 6,
                hideOnEmptyPhrase: true,
                match: {
                    enabled: false,
                    caseSensitive: false,
                    method: function(element, phrase) {
                        if (element.search(phrase) > -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                showAnimation: {
                    type: "normal",
                    time: 400,
                    callback: function() {}
                },
                hideAnimation: {
                    type: "normal",
                    time: 400,
                    callback: function() {}
                },
                onClickEvent: function() {},
                onSelectItemEvent: function() {},
                onLoadEvent: function() {},
                onChooseEvent: function() {},
                onKeyEnterEvent: function() {},
                onMouseOverEvent: function() {},
                onMouseOutEvent: function() {},
                onShowListEvent: function() {},
                onHideListEvent: function() {}
            },
            highlightPhrase: true,
            theme: "",
            cssClasses: "",
            minCharNumber: 0,
            requestDelay: 0,
            adjustWidth: true,
            ajaxSettings: {},
            preparePostData: function(data, inputPhrase) {
                return data;
            },
            loggerEnabled: true,
            template: "",
            categoriesAssigned: false,
            categories: [{
                maxNumberOfElements: 4
            }]
        };
        var externalObjects = ["ajaxSettings", "template"];
        this.get = function(propertyName) {
            return defaults[propertyName];
        }
        ;
        this.equals = function(name, value) {
            if (isAssigned(name)) {
                if (defaults[name] === value) {
                    return true;
                }
            }
            return false;
        }
        ;
        this.checkDataUrlProperties = function() {
            if (defaults.url === "list-required" && defaults.data === "list-required") {
                return false;
            }
            return true;
        }
        ;
        this.checkRequiredProperties = function() {
            for (var propertyName in defaults) {
                if (defaults[propertyName] === "required") {
                    logger.error("Option " + propertyName + " must be defined");
                    return false;
                }
            }
            return true;
        }
        ;
        this.printPropertiesThatDoesntExist = function(consol, optionsToCheck) {
            printPropertiesThatDoesntExist(consol, optionsToCheck);
        }
        ;
        prepareDefaults();
        mergeOptions();
        if (defaults.loggerEnabled === true) {
            printPropertiesThatDoesntExist(console, options);
        }
        addAjaxSettings();
        processAfterMerge();
        function prepareDefaults() {
            if (options.dataType === "xml") {
                if (!options.getValue) {
                    options.getValue = function(element) {
                        return jQuery(element).text();
                    }
                    ;
                }
                if (!options.list) {
                    options.list = {};
                }
                if (!options.list.sort) {
                    options.list.sort = {};
                }
                options.list.sort.method = function(a, b) {
                    a = options.getValue(a);
                    b = options.getValue(b);
                    if (a < b) {
                        return -1;
                    }
                    if (a > b) {
                        return 1;
                    }
                    return 0;
                }
                ;
                if (!options.list.match) {
                    options.list.match = {};
                }
                options.list.match.method = function(element, phrase) {
                    if (element.search(phrase) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
                ;
            }
            if (options.categories !== undefined && options.categories instanceof Array) {
                var categories = [];
                for (var i = 0, length = options.categories.length; i < length; i += 1) {
                    var category = options.categories[i];
                    for (var property in defaults.categories[0]) {
                        if (category[property] === undefined) {
                            category[property] = defaults.categories[0][property];
                        }
                    }
                    categories.push(category);
                }
                options.categories = categories;
            }
        }
        function mergeOptions() {
            defaults = mergeObjects(defaults, options);
            function mergeObjects(source, target) {
                var mergedObject = source || {};
                for (var propertyName in source) {
                    if (target[propertyName] !== undefined && target[propertyName] !== null) {
                        if (typeof target[propertyName] !== "object" || target[propertyName]instanceof Array) {
                            mergedObject[propertyName] = target[propertyName];
                        } else {
                            mergeObjects(source[propertyName], target[propertyName]);
                        }
                    }
                }
                if (target.data !== undefined && target.data !== null && typeof target.data === "object") {
                    mergedObject.data = target.data;
                }
                return mergedObject;
            }
        }
        function processAfterMerge() {
            if (defaults.url !== "list-required" && typeof defaults.url !== "function") {
                var defaultUrl = defaults.url;
                defaults.url = function() {
                    return defaultUrl;
                }
                ;
            }
            if (defaults.ajaxSettings.url !== undefined && typeof defaults.ajaxSettings.url !== "function") {
                var defaultUrl = defaults.ajaxSettings.url;
                defaults.ajaxSettings.url = function() {
                    return defaultUrl;
                }
                ;
            }
            if (typeof defaults.listLocation === "string") {
                var defaultlistLocation = defaults.listLocation;
                if (defaults.dataType.toUpperCase() === "XML") {
                    defaults.listLocation = function(data) {
                        return jQuery(data).find(defaultlistLocation);
                    }
                    ;
                } else {
                    defaults.listLocation = function(data) {
                        return data[defaultlistLocation];
                    }
                    ;
                }
            }
            if (typeof defaults.getValue === "string") {
                var defaultsGetValue = defaults.getValue;
                defaults.getValue = function(element) {
                    return element[defaultsGetValue];
                }
                ;
            }
            if (options.categories !== undefined) {
                defaults.categoriesAssigned = true;
            }
        }
        function addAjaxSettings() {
            if (options.ajaxSettings !== undefined && typeof options.ajaxSettings === "object") {
                defaults.ajaxSettings = options.ajaxSettings;
            } else {
                defaults.ajaxSettings = {};
            }
        }
        function isAssigned(name) {
            if (defaults[name] !== undefined && defaults[name] !== null) {
                return true;
            } else {
                return false;
            }
        }
        function printPropertiesThatDoesntExist(consol, optionsToCheck) {
            checkPropertiesIfExist(defaults, optionsToCheck);
            function checkPropertiesIfExist(source, target) {
                for (var property in target) {
                    if (source[property] === undefined) {
                        consol.log("Property '" + property + "' does not exist in EasyAutocomplete options API.");
                    }
                    if (typeof source[property] === "object" && jQuery.inArray(property, externalObjects) === -1) {
                        checkPropertiesIfExist(source[property], target[property]);
                    }
                }
            }
        }
    }
    ;
    return scope;
}
)(EasyAutocomplete || {});
var EasyAutocomplete = (function(scope) {
    scope.Logger = function Logger() {
        this.error = function(message) {
            console.log("ERROR: " + message);
        }
        ;
        this.warning = function(message) {
            console.log("WARNING: " + message);
        }
        ;
    }
    ;
    return scope;
}
)(EasyAutocomplete || {});
var EasyAutocomplete = (function(scope) {
    scope.Constans = function Constans() {
        var constants = {
            CONTAINER_CLASS: "easy-autocomplete-container",
            CONTAINER_ID: "eac-container-",
            WRAPPER_CSS_CLASS: "easy-autocomplete"
        };
        this.getValue = function(propertyName) {
            return constants[propertyName];
        }
        ;
    }
    ;
    return scope;
}
)(EasyAutocomplete || {});
var EasyAutocomplete = (function(scope) {
    scope.ListBuilderService = function ListBuilderService(configuration, proccessResponseData) {
        this.init = function(data) {
            var listBuilder = []
              , builder = {};
            builder.data = configuration.get("listLocation")(data);
            builder.getValue = configuration.get("getValue");
            builder.maxListSize = configuration.get("list").maxNumberOfElements;
            listBuilder.push(builder);
            return listBuilder;
        }
        ;
        this.updateCategories = function(listBuilder, data) {
            if (configuration.get("categoriesAssigned")) {
                listBuilder = [];
                for (var i = 0; i < configuration.get("categories").length; i += 1) {
                    var builder = convertToListBuilder(configuration.get("categories")[i], data);
                    listBuilder.push(builder);
                }
            }
            return listBuilder;
        }
        ;
        this.convertXml = function(listBuilder) {
            if (configuration.get("dataType").toUpperCase() === "XML") {
                for (var i = 0; i < listBuilder.length; i += 1) {
                    listBuilder[i].data = convertXmlToList(listBuilder[i]);
                }
            }
            return listBuilder;
        }
        ;
        this.processData = function(listBuilder, inputPhrase) {
            for (var i = 0, length = listBuilder.length; i < length; i += 1) {
                listBuilder[i].data = proccessResponseData(configuration, listBuilder[i], inputPhrase);
            }
            return listBuilder;
        }
        ;
        this.checkIfDataExists = function(listBuilders) {
            for (var i = 0, length = listBuilders.length; i < length; i += 1) {
                if (listBuilders[i].data !== undefined && listBuilders[i].data instanceof Array) {
                    if (listBuilders[i].data.length > 0) {
                        return true;
                    }
                }
            }
            return false;
        }
        ;
        function convertToListBuilder(category, data) {
            var builder = {};
            if (configuration.get("dataType").toUpperCase() === "XML") {
                builder = convertXmlToListBuilder();
            } else {
                builder = convertDataToListBuilder();
            }
            if (category.header !== undefined) {
                builder.header = category.header;
            }
            if (category.maxNumberOfElements !== undefined) {
                builder.maxNumberOfElements = category.maxNumberOfElements;
            }
            if (configuration.get("list").maxNumberOfElements !== undefined) {
                builder.maxListSize = configuration.get("list").maxNumberOfElements;
            }
            if (category.getValue !== undefined) {
                if (typeof category.getValue === "string") {
                    var defaultsGetValue = category.getValue;
                    builder.getValue = function(element) {
                        return element[defaultsGetValue];
                    }
                    ;
                } else if (typeof category.getValue === "function") {
                    builder.getValue = category.getValue;
                }
            } else {
                builder.getValue = configuration.get("getValue");
            }
            return builder;
            function convertXmlToListBuilder() {
                var builder = {}, listLocation;
                if (category.xmlElementName !== undefined) {
                    builder.xmlElementName = category.xmlElementName;
                }
                if (category.listLocation !== undefined) {
                    listLocation = category.listLocation;
                } else if (configuration.get("listLocation") !== undefined) {
                    listLocation = configuration.get("listLocation");
                }
                if (listLocation !== undefined) {
                    if (typeof listLocation === "string") {
                        builder.data = jQuery(data).find(listLocation);
                    } else if (typeof listLocation === "function") {
                        builder.data = listLocation(data);
                    }
                } else {
                    builder.data = data;
                }
                return builder;
            }
            function convertDataToListBuilder() {
                var builder = {};
                if (category.listLocation !== undefined) {
                    if (typeof category.listLocation === "string") {
                        builder.data = data[category.listLocation];
                    } else if (typeof category.listLocation === "function") {
                        builder.data = category.listLocation(data);
                    }
                } else {
                    builder.data = data;
                }
                return builder;
            }
        }
        function convertXmlToList(builder) {
            var simpleList = [];
            if (builder.xmlElementName === undefined) {
                builder.xmlElementName = configuration.get("xmlElementName");
            }
            jQuery(builder.data).find(builder.xmlElementName).each(function() {
                simpleList.push(this);
            });
            return simpleList;
        }
    }
    ;
    return scope;
}
)(EasyAutocomplete || {});
var EasyAutocomplete = (function(scope) {
    scope.proccess = function proccessData(config, listBuilder, phrase) {
        scope.proccess.match = match;
        var list = listBuilder.data
          , inputPhrase = phrase;
        list = findMatch(list, inputPhrase);
        list = reduceElementsInList(list);
        list = sort(list);
        return list;
        function findMatch(list, phrase) {
            var preparedList = []
              , value = "";
            if (config.get("list").match.enabled) {
                for (var i = 0, length = list.length; i < length; i += 1) {
                    value = config.get("getValue")(list[i]);
                    if (match(value, phrase)) {
                        preparedList.push(list[i]);
                    }
                }
            } else {
                preparedList = list;
            }
            return preparedList;
        }
        function match(value, phrase) {
            if (!config.get("list").match.caseSensitive) {
                if (typeof value === "string") {
                    value = value.toLowerCase();
                }
                phrase = phrase.toLowerCase();
            }
            if (config.get("list").match.method(value, phrase)) {
                return true;
            } else {
                return false;
            }
        }
        function reduceElementsInList(list) {
            if (listBuilder.maxNumberOfElements !== undefined && list.length > listBuilder.maxNumberOfElements) {
                list = list.slice(0, listBuilder.maxNumberOfElements);
            }
            return list;
        }
        function sort(list) {
            if (config.get("list").sort.enabled) {
                list.sort(config.get("list").sort.method);
            }
            return list;
        }
    }
    ;
    return scope;
}
)(EasyAutocomplete || {});
var EasyAutocomplete = (function(scope) {
    scope.Template = function Template(options) {
        var genericTemplates = {
            basic: {
                type: "basic",
                method: function(element) {
                    return element;
                },
                cssClass: ""
            },
            description: {
                type: "description",
                fields: {
                    description: "description"
                },
                method: function(element) {
                    return element + " - description";
                },
                cssClass: "eac-description"
            },
            iconLeft: {
                type: "iconLeft",
                fields: {
                    icon: ""
                },
                method: function(element) {
                    return element;
                },
                cssClass: "eac-icon-left"
            },
            iconRight: {
                type: "iconRight",
                fields: {
                    iconSrc: ""
                },
                method: function(element) {
                    return element;
                },
                cssClass: "eac-icon-right"
            },
            links: {
                type: "links",
                fields: {
                    link: ""
                },
                method: function(element) {
                    return element;
                },
                cssClass: ""
            },
            custom: {
                type: "custom",
                method: function() {},
                cssClass: ""
            }
        }
          , convertTemplateToMethod = function(template) {
            var _fields = template.fields, buildMethod;
            if (template.type === "description") {
                buildMethod = genericTemplates.description.method;
                if (typeof _fields.description === "string") {
                    buildMethod = function(elementValue, element) {
                        return elementValue + " - <span>" + element[_fields.description] + "</span>";
                    }
                    ;
                } else if (typeof _fields.description === "function") {
                    buildMethod = function(elementValue, element) {
                        return elementValue + " - <span>" + _fields.description(element) + "</span>";
                    }
                    ;
                }
                return buildMethod;
            }
            if (template.type === "iconRight") {
                if (typeof _fields.iconSrc === "string") {
                    buildMethod = function(elementValue, element) {
                        return elementValue + "<img class='eac-icon' src='" + element[_fields.iconSrc] + "' />";
                    }
                    ;
                } else if (typeof _fields.iconSrc === "function") {
                    buildMethod = function(elementValue, element) {
                        return elementValue + "<img class='eac-icon' src='" + _fields.iconSrc(element) + "' />";
                    }
                    ;
                }
                return buildMethod;
            }
            if (template.type === "iconLeft") {
                if (typeof _fields.iconSrc === "string") {
                    buildMethod = function(elementValue, element) {
                        return "<img class='eac-icon' src='" + element[_fields.iconSrc] + "' />" + elementValue;
                    }
                    ;
                } else if (typeof _fields.iconSrc === "function") {
                    buildMethod = function(elementValue, element) {
                        return "<img class='eac-icon' src='" + _fields.iconSrc(element) + "' />" + elementValue;
                    }
                    ;
                }
                return buildMethod;
            }
            if (template.type === "links") {
                if (typeof _fields.link === "string") {
                    buildMethod = function(elementValue, element) {
                        return "<a href='" + element[_fields.link] + "' >" + elementValue + "</a>";
                    }
                    ;
                } else if (typeof _fields.link === "function") {
                    buildMethod = function(elementValue, element) {
                        return "<a href='" + _fields.link(element) + "' >" + elementValue + "</a>";
                    }
                    ;
                }
                return buildMethod;
            }
            if (template.type === "custom") {
                return template.method;
            }
            return genericTemplates.basic.method;
        }
          , prepareBuildMethod = function(options) {
            if (!options || !options.type) {
                return genericTemplates.basic.method;
            }
            if (options.type && genericTemplates[options.type]) {
                return convertTemplateToMethod(options);
            } else {
                return genericTemplates.basic.method;
            }
        }
          , templateClass = function(options) {
            var emptyStringFunction = function() {
                return "";
            };
            if (!options || !options.type) {
                return emptyStringFunction;
            }
            if (options.type && genericTemplates[options.type]) {
                return (function() {
                    var _cssClass = genericTemplates[options.type].cssClass;
                    return function() {
                        return _cssClass;
                    }
                    ;
                }
                )();
            } else {
                return emptyStringFunction;
            }
        };
        this.getTemplateClass = templateClass(options);
        this.build = prepareBuildMethod(options);
    }
    ;
    return scope;
}
)(EasyAutocomplete || {});
var EasyAutocomplete = (function(scope) {
    scope.main = function Core($input, options) {
        var module = {
            name: "EasyAutocomplete",
            shortcut: "eac"
        };
        var consts = new scope.Constans(), config = new scope.Configuration(options), logger = new scope.Logger(), template = new scope.Template(options.template), listBuilderService = new scope.ListBuilderService(config,scope.proccess), checkParam = config.equals, $field = $input, $container = "", elementsList = [], selectedElement = -1, requestDelayTimeoutId;
        scope.consts = consts;
        this.getConstants = function() {
            return consts;
        }
        ;
        this.getConfiguration = function() {
            return config;
        }
        ;
        this.getContainer = function() {
            return $container;
        }
        ;
        this.getSelectedItemIndex = function() {
            return selectedElement;
        }
        ;
        this.getItems = function() {
            return elementsList;
        }
        ;
        this.getItemData = function(index) {
            if (elementsList.length < index || elementsList[index] === undefined) {
                return -1;
            } else {
                return elementsList[index];
            }
        }
        ;
        this.getSelectedItemData = function() {
            return this.getItemData(selectedElement);
        }
        ;
        this.build = function() {
            prepareField();
        }
        ;
        this.init = function() {
            init();
        }
        ;
        function init() {
            if ($field.length === 0) {
                logger.error("Input field doesn't exist.");
                return;
            }
            if (!config.checkDataUrlProperties()) {
                logger.error("One of options variables 'data' or 'url' must be defined.");
                return;
            }
            if (!config.checkRequiredProperties()) {
                logger.error("Will not work without mentioned properties.");
                return;
            }
            prepareField();
            bindEvents();
        }
        function prepareField() {
            if ($field.parent().hasClass(consts.getValue("WRAPPER_CSS_CLASS"))) {
                removeContainer();
                removeWrapper();
            }
            createWrapper();
            createContainer();
            $container = jQuery("#" + getContainerId());
            if (config.get("placeholder")) {
                $field.attr("placeholder", config.get("placeholder"));
            }
            function createWrapper() {
                var $wrapper = jQuery("<div>")
                  , classes = consts.getValue("WRAPPER_CSS_CLASS");
                if (config.get("theme") && config.get("theme") !== "") {
                    classes += " eac-" + config.get("theme");
                }
                if (config.get("cssClasses") && config.get("cssClasses") !== "") {
                    classes += " " + config.get("cssClasses");
                }
                if (template.getTemplateClass() !== "") {
                    classes += " " + template.getTemplateClass();
                }
                $wrapper.addClass(classes);
                $field.wrap($wrapper);
                if (config.get("adjustWidth") === true) {
                    adjustWrapperWidth();
                }
            }
            function adjustWrapperWidth() {
                var fieldWidth = $field.outerWidth();
                $field.parent().css("width", fieldWidth);
            }
            function removeWrapper() {
                $field.unwrap();
            }
            function createContainer() {
                var $elements_container = jQuery("<div>").addClass(consts.getValue("CONTAINER_CLASS"));
                $elements_container.attr("id", getContainerId()).prepend(jQuery("<ul>"));
                (function() {
                    $elements_container.on("show.eac", function() {
                        switch (config.get("list").showAnimation.type) {
                        case "slide":
                            var animationTime = config.get("list").showAnimation.time
                              , callback = config.get("list").showAnimation.callback;
                            $elements_container.find("ul").slideDown(animationTime, callback);
                            break;
                        case "fade":
                            var animationTime = config.get("list").showAnimation.time
                              , callback = config.get("list").showAnimation.callback;
                            $elements_container.find("ul").fadeIn(animationTime),
                            callback;
                            break;
                        default:
                            $elements_container.find("ul").show();
                            break;
                        }
                        config.get("list").onShowListEvent();
                    }).on("hide.eac", function() {
                        switch (config.get("list").hideAnimation.type) {
                        case "slide":
                            var animationTime = config.get("list").hideAnimation.time
                              , callback = config.get("list").hideAnimation.callback;
                            $elements_container.find("ul").slideUp(animationTime, callback);
                            break;
                        case "fade":
                            var animationTime = config.get("list").hideAnimation.time
                              , callback = config.get("list").hideAnimation.callback;
                            $elements_container.find("ul").fadeOut(animationTime, callback);
                            break;
                        default:
                            $elements_container.find("ul").hide();
                            break;
                        }
                        config.get("list").onHideListEvent();
                    }).on("selectElement.eac", function() {
                        $elements_container.find("ul li").removeClass("selected");
                        $elements_container.find("ul li").eq(selectedElement).addClass("selected");
                        config.get("list").onSelectItemEvent();
                    }).on("loadElements.eac", function(event, listBuilders, phrase) {
                        var $item = ""
                          , $listContainer = $elements_container.find("ul");
                        $listContainer.empty().detach();
                        elementsList = [];
                        var counter = 0;
                        for (var builderIndex = 0, listBuildersLength = listBuilders.length; builderIndex < listBuildersLength; builderIndex += 1) {
                            var listData = listBuilders[builderIndex].data;
                            if (listData.length === 0) {
                                continue;
                            }
                            if (listBuilders[builderIndex].header !== undefined && listBuilders[builderIndex].header.length > 0) {
                                $listContainer.append("<div class='eac-category' >" + listBuilders[builderIndex].header + "</div>");
                            }
                            for (var i = 0, listDataLength = listData.length; i < listDataLength && counter < listBuilders[builderIndex].maxListSize; i += 1) {
                                $item = jQuery("<li><div class='eac-item'></div></li>");
                                (function() {
                                    var j = i
                                      , itemCounter = counter
                                      , elementsValue = listBuilders[builderIndex].getValue(listData[j]);
                                    $item.find(" > div").on("click", function() {
                                        $field.val(elementsValue).trigger("change");
                                        selectedElement = itemCounter;
                                        selectElement(itemCounter);
                                        config.get("list").onClickEvent();
                                        config.get("list").onChooseEvent();
                                    }).mouseover(function() {
                                        selectedElement = itemCounter;
                                        selectElement(itemCounter);
                                        config.get("list").onMouseOverEvent();
                                    }).mouseout(function() {
                                        config.get("list").onMouseOutEvent();
                                    }).html(template.build(highlight(elementsValue, phrase), listData[j]));
                                }
                                )();
                                $listContainer.append($item);
                                elementsList.push(listData[i]);
                                counter += 1;
                            }
                        }
                        $elements_container.append($listContainer);
                        config.get("list").onLoadEvent();
                    });
                }
                )();
                $field.after($elements_container);
            }
            function removeContainer() {
                $field.next("." + consts.getValue("CONTAINER_CLASS")).remove();
            }
            function highlight(string, phrase) {
                if (config.get("highlightPhrase") && phrase !== "") {
                    return highlightPhrase(string, phrase);
                } else {
                    return string;
                }
            }
            function escapeRegExp(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            }
            function highlightPhrase(string, phrase) {
                var escapedPhrase = escapeRegExp(phrase);
                return (string + "").replace(new RegExp("(" + escapedPhrase + ")","gi"), "<b>$1</b>");
            }
        }
        function getContainerId() {
            var elementId = $field.attr("id");
            elementId = consts.getValue("CONTAINER_ID") + elementId;
            return elementId;
        }
        function bindEvents() {
            bindAllEvents();
            function bindAllEvents() {
                if (checkParam("autocompleteOff", true)) {
                    removeAutocomplete();
                }
                bindFocusOut();
                bindKeyup();
                bindKeydown();
                bindKeypress();
                bindFocus();
                bindBlur();
            }
            function bindFocusOut() {
                $field.focusout(function() {
                    var fieldValue = $field.val(), phrase;
                    if (!config.get("list").match.caseSensitive) {
                        fieldValue = fieldValue.toLowerCase();
                    }
                    for (var i = 0, length = elementsList.length; i < length; i += 1) {
                        phrase = config.get("getValue")(elementsList[i]);
                        if (!config.get("list").match.caseSensitive) {
                            phrase = phrase.toLowerCase();
                        }
                        if (phrase === fieldValue) {
                            selectedElement = i;
                            selectElement(selectedElement);
                            return;
                        }
                    }
                });
            }
            function bindKeyup() {
                $field.off("keyup").keyup(function(event) {
                    switch (event.keyCode) {
                    case 27:
                        hideContainer();
                        loseFieldFocus();
                        break;
                    case 38:
                        event.preventDefault();
                        if (elementsList.length > 0 && selectedElement > 0) {
                            selectedElement -= 1;
                            $field.val(config.get("getValue")(elementsList[selectedElement]));
                            selectElement(selectedElement);
                        }
                        break;
                    case 40:
                        event.preventDefault();
                        if (elementsList.length > 0 && selectedElement < elementsList.length - 1) {
                            selectedElement += 1;
                            $field.val(config.get("getValue")(elementsList[selectedElement]));
                            selectElement(selectedElement);
                        }
                        break;
                    default:
                        if (event.keyCode > 40 || event.keyCode === 8) {
                            var inputPhrase = $field.val();
                            if (!(config.get("list").hideOnEmptyPhrase === true && event.keyCode === 8 && inputPhrase === "")) {
                                if (config.get("requestDelay") > 0) {
                                    if (requestDelayTimeoutId !== undefined) {
                                        clearTimeout(requestDelayTimeoutId);
                                    }
                                    requestDelayTimeoutId = setTimeout(function() {
                                        loadData(inputPhrase);
                                    }, config.get("requestDelay"));
                                } else {
                                    loadData(inputPhrase);
                                }
                            } else {
                                hideContainer();
                            }
                        }
                        break;
                    }
                    function loadData(inputPhrase) {
                        if (inputPhrase.length < config.get("minCharNumber")) {
                            return;
                        }
                        if (config.get("data") !== "list-required") {
                            var data = config.get("data");
                            var listBuilders = listBuilderService.init(data);
                            listBuilders = listBuilderService.updateCategories(listBuilders, data);
                            listBuilders = listBuilderService.processData(listBuilders, inputPhrase);
                            loadElements(listBuilders, inputPhrase);
                            if ($field.parent().find("li").length > 0) {
                                showContainer();
                            } else {
                                hideContainer();
                            }
                        }
                        var settings = createAjaxSettings();
                        if (settings.url === undefined || settings.url === "") {
                            settings.url = config.get("url");
                        }
                        if (settings.dataType === undefined || settings.dataType === "") {
                            settings.dataType = config.get("dataType");
                        }
                        if (settings.url !== undefined && settings.url !== "list-required") {
                            settings.url = settings.url(inputPhrase);
                            settings.data = config.get("preparePostData")(settings.data, inputPhrase);
                            jQuery.ajax(settings).done(function(data) {
                                var listBuilders = listBuilderService.init(data);
                                listBuilders = listBuilderService.updateCategories(listBuilders, data);
                                listBuilders = listBuilderService.convertXml(listBuilders);
                                if (checkInputPhraseMatchResponse(inputPhrase, data)) {
                                    listBuilders = listBuilderService.processData(listBuilders, inputPhrase);
                                    loadElements(listBuilders, inputPhrase);
                                }
                                if (listBuilderService.checkIfDataExists(listBuilders) && $field.parent().find("li").length > 0) {
                                    showContainer();
                                } else {
                                    hideContainer();
                                }
                                config.get("ajaxCallback")();
                            }).fail(function() {
                                logger.warning("Fail to load response data");
                            }).always(function() {});
                        }
                        function createAjaxSettings() {
                            var settings = {}
                              , ajaxSettings = config.get("ajaxSettings") || {};
                            for (var set in ajaxSettings) {
                                settings[set] = ajaxSettings[set];
                            }
                            return settings;
                        }
                        function checkInputPhraseMatchResponse(inputPhrase, data) {
                            if (config.get("matchResponseProperty") !== false) {
                                if (typeof config.get("matchResponseProperty") === "string") {
                                    return (data[config.get("matchResponseProperty")] === inputPhrase);
                                }
                                if (typeof config.get("matchResponseProperty") === "function") {
                                    return (config.get("matchResponseProperty")(data) === inputPhrase);
                                }
                                return true;
                            } else {
                                return true;
                            }
                        }
                    }
                });
            }
            function bindKeydown() {
                $field.on("keydown", function(evt) {
                    evt = evt || window.event;
                    var keyCode = evt.keyCode;
                    if (keyCode === 38) {
                        suppressKeypress = true;
                        return false;
                    }
                }).keydown(function(event) {
                    if (event.keyCode === 13 && selectedElement > -1) {
                        $field.val(config.get("getValue")(elementsList[selectedElement]));
                        config.get("list").onKeyEnterEvent();
                        config.get("list").onChooseEvent();
                        selectedElement = -1;
                        hideContainer();
                        event.preventDefault();
                    }
                });
            }
            function bindKeypress() {
                $field.off("keypress");
            }
            function bindFocus() {
                $field.focus(function() {
                    if ($field.val() !== "" && elementsList.length > 0) {
                        selectedElement = -1;
                        showContainer();
                    }
                });
            }
            function bindBlur() {
                $field.blur(function() {
                    setTimeout(function() {
                        selectedElement = -1;
                        hideContainer();
                    }, 250);
                });
            }
            function removeAutocomplete() {
                $field.attr("autocomplete", "off");
            }
        }
        function showContainer() {
            $container.trigger("show.eac");
        }
        function hideContainer() {
            $container.trigger("hide.eac");
        }
        function selectElement(index) {
            $container.trigger("selectElement.eac", index);
        }
        function loadElements(list, phrase) {
            $container.trigger("loadElements.eac", [list, phrase]);
        }
        function loseFieldFocus() {
            $field.trigger("blur");
        }
    }
    ;
    scope.eacHandles = [];
    scope.getHandle = function(id) {
        return scope.eacHandles[id];
    }
    ;
    scope.inputHasId = function(input) {
        if (jQuery(input).attr("id") !== undefined && jQuery(input).attr("id").length > 0) {
            return true;
        } else {
            return false;
        }
    }
    ;
    scope.assignRandomId = function(input) {
        var fieldId = "";
        do {
            fieldId = "eac-" + Math.floor(Math.random() * 10000);
        } while (jQuery("#" + fieldId).length !== 0);elementId = scope.consts.getValue("CONTAINER_ID") + fieldId;
        jQuery(input).attr("id", fieldId);
    }
    ;
    scope.setHandle = function(handle, id) {
        scope.eacHandles[id] = handle;
    }
    ;
    return scope;
}
)(EasyAutocomplete || {});
(function($) {
    jQuery.fn.easyAutocomplete = function(options) {
        return this.each(function() {
            var $this = jQuery(this)
              , eacHandle = new EasyAutocomplete.main($this,options);
            if (!EasyAutocomplete.inputHasId($this)) {
                EasyAutocomplete.assignRandomId($this);
            }
            eacHandle.init();
            EasyAutocomplete.setHandle(eacHandle, $this.attr("id"));
        });
    }
    ;
    jQuery.fn.getSelectedItemIndex = function() {
        var inputId = jQuery(this).attr("id");
        if (inputId !== undefined) {
            return EasyAutocomplete.getHandle(inputId).getSelectedItemIndex();
        }
        return -1;
    }
    ;
    jQuery.fn.getItems = function() {
        var inputId = jQuery(this).attr("id");
        if (inputId !== undefined) {
            return EasyAutocomplete.getHandle(inputId).getItems();
        }
        return -1;
    }
    ;
    jQuery.fn.getItemData = function(index) {
        var inputId = jQuery(this).attr("id");
        if (inputId !== undefined && index > -1) {
            return EasyAutocomplete.getHandle(inputId).getItemData(index);
        }
        return -1;
    }
    ;
    jQuery.fn.getSelectedItemData = function() {
        var inputId = jQuery(this).attr("id");
        if (inputId !== undefined) {
            return EasyAutocomplete.getHandle(inputId).getSelectedItemData();
        }
        return -1;
    }
    ;
}
)(jQuery);
;(function($) {
    $.session = {
        _id: null,
        _cookieCache: undefined,
        _init: function() {
            if (!window.name) {
                window.name = Math.random();
            }
            this._id = window.name;
            this._initCache();
            var matches = (new RegExp(this._generatePrefix() + "=([^;]+);")).exec(document.cookie);
            if (matches && document.location.protocol !== matches[1]) {
                this._clearSession();
                for (var key in this._cookieCache) {
                    try {
                        window.sessionStorage.setItem(key, this._cookieCache[key]);
                    } catch (e) {}
                    ;
                }
            }
            document.cookie = this._generatePrefix() + "=" + document.location.protocol + ';path=/;expires=' + (new Date((new Date).getTime() + 120000)).toUTCString();
        },
        _generatePrefix: function() {
            return '__session:' + this._id + ':';
        },
        _initCache: function() {
            var cookies = document.cookie.split(';');
            this._cookieCache = {};
            for (var i in cookies) {
                var kv = cookies[i].split('=');
                if ((new RegExp(this._generatePrefix() + '.+')).test(kv[0]) && kv[1]) {
                    this._cookieCache[kv[0].split(':', 3)[2]] = kv[1];
                }
            }
        },
        _setFallback: function(key, value, onceOnly) {
            var cookie = this._generatePrefix() + key + "=" + value + "; path=/";
            if (onceOnly) {
                cookie += "; expires=" + (new Date(Date.now() + 120000)).toUTCString();
            }
            document.cookie = cookie;
            this._cookieCache[key] = value;
            return this;
        },
        _getFallback: function(key) {
            if (!this._cookieCache) {
                this._initCache();
            }
            return this._cookieCache[key];
        },
        _clearFallback: function() {
            for (var i in this._cookieCache) {
                document.cookie = this._generatePrefix() + i + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
            this._cookieCache = {};
        },
        _deleteFallback: function(key) {
            document.cookie = this._generatePrefix() + key + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            delete this._cookieCache[key];
        },
        get: function(key) {
            return window.sessionStorage.getItem(key) || this._getFallback(key);
        },
        set: function(key, value, onceOnly) {
            try {
                window.sessionStorage.setItem(key, value);
            } catch (e) {}
            this._setFallback(key, value, onceOnly || false);
            return this;
        },
        'delete': function(key) {
            return this.remove(key);
        },
        remove: function(key) {
            try {
                window.sessionStorage.removeItem(key);
            } catch (e) {}
            ;this._deleteFallback(key);
            return this;
        },
        _clearSession: function() {
            try {
                window.sessionStorage.clear();
            } catch (e) {
                for (var i in window.sessionStorage) {
                    window.sessionStorage.removeItem(i);
                }
            }
        },
        clear: function() {
            this._clearSession();
            this._clearFallback();
            return this;
        }
    };
    $.session._init();
}
)(jQuery);
;!function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd)
        define([], e);
    else {
        var n;
        "undefined" != typeof window ? n = window : "undefined" != typeof global ? n = global : "undefined" != typeof self && (n = self),
        n.geojsonExtent = e()
    }
}(function() {
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = "function" == typeof require && require;
                    if (!u && a)
                        return a(o, !0);
                    if (i)
                        return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND",
                    f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        for (var i = "function" == typeof require && require, o = 0; o < r.length; o++)
            s(r[o]);
        return s
    }({
        1: [function(require, module) {
            function getExtent(_) {
                for (var ext = extent(), coords = geojsonCoords(_), i = 0; i < coords.length; i++)
                    ext.include(coords[i]);
                return ext
            }
            var geojsonCoords = require("geojson-coords")
              , traverse = require("traverse")
              , extent = require("extent")
              , geojsonTypes = ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "Feature", "FeatureCollection", "GeometryCollection"];
            module.exports = function(_) {
                return getExtent(_).bbox()
            }
            ,
            module.exports.polygon = function(_) {
                return getExtent(_).polygon()
            }
            ,
            module.exports.bboxify = function(_) {
                return traverse(_).map(function(value) {
                    value && -1 !== typeof geojsonTypes.indexOf(value.type) && (console.log(value.type, value),
                    value.bbox = getExtent(value).bbox(),
                    this.update(value))
                })
            }
        }
        , {
            extent: 2,
            "geojson-coords": 4,
            traverse: 7
        }],
        2: [function(require, module) {
            function Extent() {
                return this instanceof Extent ? (this._bbox = [1 / 0, 1 / 0, -(1 / 0), -(1 / 0)],
                void (this._valid = !1)) : new Extent
            }
            module.exports = Extent,
            Extent.prototype.include = function(ll) {
                return this._valid = !0,
                this._bbox[0] = Math.min(this._bbox[0], ll[0]),
                this._bbox[1] = Math.min(this._bbox[1], ll[1]),
                this._bbox[2] = Math.max(this._bbox[2], ll[0]),
                this._bbox[3] = Math.max(this._bbox[3], ll[1]),
                this
            }
            ,
            Extent.prototype.union = function(other) {
                return this._valid = !0,
                this._bbox[0] = Math.min(this._bbox[0], other[0]),
                this._bbox[1] = Math.min(this._bbox[1], other[1]),
                this._bbox[2] = Math.max(this._bbox[2], other[2]),
                this._bbox[3] = Math.max(this._bbox[3], other[3]),
                this
            }
            ,
            Extent.prototype.bbox = function() {
                return this._valid ? this._bbox : null
            }
            ,
            Extent.prototype.contains = function(ll) {
                return this._valid ? this._bbox[0] <= ll[0] && this._bbox[1] <= ll[1] && this._bbox[2] >= ll[0] && this._bbox[3] >= ll[1] : null
            }
            ,
            Extent.prototype.polygon = function() {
                return this._valid ? {
                    type: "Polygon",
                    coordinates: [[[this._bbox[0], this._bbox[1]], [this._bbox[2], this._bbox[1]], [this._bbox[2], this._bbox[3]], [this._bbox[0], this._bbox[3]], [this._bbox[0], this._bbox[1]]]]
                } : null
            }
        }
        , {}],
        3: [function(require, module) {
            module.exports = function(list) {
                function _flatten(list) {
                    return Array.isArray(list) && list.length && "number" == typeof list[0] ? [list] : list.reduce(function(acc, item) {
                        return Array.isArray(item) && Array.isArray(item[0]) ? acc.concat(_flatten(item)) : (acc.push(item),
                        acc)
                    }, [])
                }
                return _flatten(list)
            }
        }
        , {}],
        4: [function(require, module) {
            var geojsonNormalize = require("geojson-normalize")
              , geojsonFlatten = require("geojson-flatten")
              , flatten = require("./flatten");
            module.exports = function(_) {
                if (!_)
                    return [];
                var normalized = geojsonFlatten(geojsonNormalize(_))
                  , coordinates = [];
                return normalized.features.forEach(function(feature) {
                    feature.geometry && (coordinates = coordinates.concat(flatten(feature.geometry.coordinates)))
                }),
                coordinates
            }
        }
        , {
            "./flatten": 3,
            "geojson-flatten": 5,
            "geojson-normalize": 6
        }],
        5: [function(require, module) {
            function flatten(gj) {
                switch (gj && gj.type || null) {
                case "FeatureCollection":
                    return gj.features = gj.features.reduce(function(mem, feature) {
                        return mem.concat(flatten(feature))
                    }, []),
                    gj;
                case "Feature":
                    return flatten(gj.geometry).map(function(geom) {
                        return {
                            type: "Feature",
                            properties: JSON.parse(JSON.stringify(gj.properties)),
                            geometry: geom
                        }
                    });
                case "MultiPoint":
                    return gj.coordinates.map(function(_) {
                        return {
                            type: "Point",
                            coordinates: _
                        }
                    });
                case "MultiPolygon":
                    return gj.coordinates.map(function(_) {
                        return {
                            type: "Polygon",
                            coordinates: _
                        }
                    });
                case "MultiLineString":
                    return gj.coordinates.map(function(_) {
                        return {
                            type: "LineString",
                            coordinates: _
                        }
                    });
                case "GeometryCollection":
                    return gj.geometries;
                case "Point":
                case "Polygon":
                case "LineString":
                    return [gj];
                default:
                    return gj
                }
            }
            module.exports = flatten
        }
        , {}],
        6: [function(require, module) {
            function normalize(gj) {
                if (!gj || !gj.type)
                    return null;
                var type = types[gj.type];
                return type ? "geometry" === type ? {
                    type: "FeatureCollection",
                    features: [{
                        type: "Feature",
                        properties: {},
                        geometry: gj
                    }]
                } : "feature" === type ? {
                    type: "FeatureCollection",
                    features: [gj]
                } : "featurecollection" === type ? gj : void 0 : null
            }
            module.exports = normalize;
            var types = {
                Point: "geometry",
                MultiPoint: "geometry",
                LineString: "geometry",
                MultiLineString: "geometry",
                Polygon: "geometry",
                MultiPolygon: "geometry",
                GeometryCollection: "geometry",
                Feature: "feature",
                FeatureCollection: "featurecollection"
            }
        }
        , {}],
        7: [function(require, module) {
            function Traverse(obj) {
                this.value = obj
            }
            function walk(root, cb, immutable) {
                var path = []
                  , parents = []
                  , alive = !0;
                return function walker(node_) {
                    function updateState() {
                        if ("object" == typeof state.node && null !== state.node) {
                            state.keys && state.node_ === state.node || (state.keys = objectKeys(state.node)),
                            state.isLeaf = 0 == state.keys.length;
                            for (var i = 0; i < parents.length; i++)
                                if (parents[i].node_ === node_) {
                                    state.circular = parents[i];
                                    break
                                }
                        } else
                            state.isLeaf = !0,
                            state.keys = null;
                        state.notLeaf = !state.isLeaf,
                        state.notRoot = !state.isRoot
                    }
                    var node = immutable ? copy(node_) : node_
                      , modifiers = {}
                      , keepGoing = !0
                      , state = {
                        node: node,
                        node_: node_,
                        path: [].concat(path),
                        parent: parents[parents.length - 1],
                        parents: parents,
                        key: path.slice(-1)[0],
                        isRoot: 0 === path.length,
                        level: path.length,
                        circular: null,
                        update: function(x, stopHere) {
                            state.isRoot || (state.parent.node[state.key] = x),
                            state.node = x,
                            stopHere && (keepGoing = !1)
                        },
                        "delete": function(stopHere) {
                            delete state.parent.node[state.key],
                            stopHere && (keepGoing = !1)
                        },
                        remove: function(stopHere) {
                            isArray(state.parent.node) ? state.parent.node.splice(state.key, 1) : delete state.parent.node[state.key],
                            stopHere && (keepGoing = !1)
                        },
                        keys: null,
                        before: function(f) {
                            modifiers.before = f
                        },
                        after: function(f) {
                            modifiers.after = f
                        },
                        pre: function(f) {
                            modifiers.pre = f
                        },
                        post: function(f) {
                            modifiers.post = f
                        },
                        stop: function() {
                            alive = !1
                        },
                        block: function() {
                            keepGoing = !1
                        }
                    };
                    if (!alive)
                        return state;
                    updateState();
                    var ret = cb.call(state, state.node);
                    return void 0 !== ret && state.update && state.update(ret),
                    modifiers.before && modifiers.before.call(state, state.node),
                    keepGoing ? ("object" != typeof state.node || null === state.node || state.circular || (parents.push(state),
                    updateState(),
                    forEach(state.keys, function(key, i) {
                        path.push(key),
                        modifiers.pre && modifiers.pre.call(state, state.node[key], key);
                        var child = walker(state.node[key]);
                        immutable && hasOwnProperty.call(state.node, key) && (state.node[key] = child.node),
                        child.isLast = i == state.keys.length - 1,
                        child.isFirst = 0 == i,
                        modifiers.post && modifiers.post.call(state, child),
                        path.pop()
                    }),
                    parents.pop()),
                    modifiers.after && modifiers.after.call(state, state.node),
                    state) : state
                }(root).node
            }
            function copy(src) {
                if ("object" == typeof src && null !== src) {
                    var dst;
                    if (isArray(src))
                        dst = [];
                    else if (isDate(src))
                        dst = new Date(src.getTime ? src.getTime() : src);
                    else if (isRegExp(src))
                        dst = new RegExp(src);
                    else if (isError(src))
                        dst = {
                            message: src.message
                        };
                    else if (isBoolean(src))
                        dst = new Boolean(src);
                    else if (isNumber(src))
                        dst = new Number(src);
                    else if (isString(src))
                        dst = new String(src);
                    else if (Object.create && Object.getPrototypeOf)
                        dst = Object.create(Object.getPrototypeOf(src));
                    else if (src.constructor === Object)
                        dst = {};
                    else {
                        var proto = src.constructor && src.constructor.prototype || src.__proto__ || {}
                          , T = function() {};
                        T.prototype = proto,
                        dst = new T
                    }
                    return forEach(objectKeys(src), function(key) {
                        dst[key] = src[key]
                    }),
                    dst
                }
                return src
            }
            function toS(obj) {
                return Object.prototype.toString.call(obj)
            }
            function isDate(obj) {
                return "[object Date]" === toS(obj)
            }
            function isRegExp(obj) {
                return "[object RegExp]" === toS(obj)
            }
            function isError(obj) {
                return "[object Error]" === toS(obj)
            }
            function isBoolean(obj) {
                return "[object Boolean]" === toS(obj)
            }
            function isNumber(obj) {
                return "[object Number]" === toS(obj)
            }
            function isString(obj) {
                return "[object String]" === toS(obj)
            }
            var traverse = module.exports = function(obj) {
                return new Traverse(obj)
            }
            ;
            Traverse.prototype.get = function(ps) {
                for (var node = this.value, i = 0; i < ps.length; i++) {
                    var key = ps[i];
                    if (!node || !hasOwnProperty.call(node, key)) {
                        node = void 0;
                        break
                    }
                    node = node[key]
                }
                return node
            }
            ,
            Traverse.prototype.has = function(ps) {
                for (var node = this.value, i = 0; i < ps.length; i++) {
                    var key = ps[i];
                    if (!node || !hasOwnProperty.call(node, key))
                        return !1;
                    node = node[key]
                }
                return !0
            }
            ,
            Traverse.prototype.set = function(ps, value) {
                for (var node = this.value, i = 0; i < ps.length - 1; i++) {
                    var key = ps[i];
                    hasOwnProperty.call(node, key) || (node[key] = {}),
                    node = node[key]
                }
                return node[ps[i]] = value,
                value
            }
            ,
            Traverse.prototype.map = function(cb) {
                return walk(this.value, cb, !0)
            }
            ,
            Traverse.prototype.forEach = function(cb) {
                return this.value = walk(this.value, cb, !1),
                this.value
            }
            ,
            Traverse.prototype.reduce = function(cb, init) {
                var skip = 1 === arguments.length
                  , acc = skip ? this.value : init;
                return this.forEach(function(x) {
                    this.isRoot && skip || (acc = cb.call(this, acc, x))
                }),
                acc
            }
            ,
            Traverse.prototype.paths = function() {
                var acc = [];
                return this.forEach(function() {
                    acc.push(this.path)
                }),
                acc
            }
            ,
            Traverse.prototype.nodes = function() {
                var acc = [];
                return this.forEach(function() {
                    acc.push(this.node)
                }),
                acc
            }
            ,
            Traverse.prototype.clone = function() {
                var parents = []
                  , nodes = [];
                return function clone(src) {
                    for (var i = 0; i < parents.length; i++)
                        if (parents[i] === src)
                            return nodes[i];
                    if ("object" == typeof src && null !== src) {
                        var dst = copy(src);
                        return parents.push(src),
                        nodes.push(dst),
                        forEach(objectKeys(src), function(key) {
                            dst[key] = clone(src[key])
                        }),
                        parents.pop(),
                        nodes.pop(),
                        dst
                    }
                    return src
                }(this.value)
            }
            ;
            var objectKeys = Object.keys || function(obj) {
                var res = [];
                for (var key in obj)
                    res.push(key);
                return res
            }
              , isArray = Array.isArray || function(xs) {
                return "[object Array]" === Object.prototype.toString.call(xs)
            }
              , forEach = function(xs, fn) {
                if (xs.forEach)
                    return xs.forEach(fn);
                for (var i = 0; i < xs.length; i++)
                    fn(xs[i], i, xs)
            };
            forEach(objectKeys(Traverse.prototype), function(key) {
                traverse[key] = function(obj) {
                    var args = [].slice.call(arguments, 1)
                      , t = new Traverse(obj);
                    return t[key].apply(t, args)
                }
            });
            var hasOwnProperty = Object.hasOwnProperty || function(obj, key) {
                return key in obj
            }
        }
        , {}]
    }, {}, [1])(1)
});
;;(function(root, factory) {
    if (typeof module == 'object' && module.exports)
        module.exports = factory()
    else if (typeof define == 'function' && define.amd)
        define(factory)
    else
        root.Spinner = factory()
}(this, function() {
    "use strict"
    var prefixes = ['webkit', 'Moz', 'ms', 'O'], animations = {}, useCssAnimations, sheet
    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div'), n
        for (n in prop)
            el[n] = prop[n]
        return el
    }
    function ins(parent) {
        for (var i = 1, n = arguments.length; i < n; i++) {
            parent.appendChild(arguments[i])
        }
        return parent
    }
    function addAnimation(alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-')
          , start = 0.01 + i / lines * 100
          , z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha)
          , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
          , pre = prefix && '-' + prefix + '-' || ''
        if (!animations[name]) {
            sheet.insertRule('@' + pre + 'keyframes ' + name + '{' + '0%{opacity:' + z + '}' + start + '%{opacity:' + alpha + '}' + (start + 0.01) + '%{opacity:1}' + (start + trail) % 100 + '%{opacity:' + alpha + '}' + '100%{opacity:' + z + '}' + '}', sheet.cssRules.length)
            animations[name] = 1
        }
        return name
    }
    function vendor(el, prop) {
        var s = el.style, pp, i
        prop = prop.charAt(0).toUpperCase() + prop.slice(1)
        if (s[prop] !== undefined)
            return prop
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i] + prop
            if (s[pp] !== undefined)
                return pp
        }
    }
    function css(el, prop) {
        for (var n in prop) {
            el.style[vendor(el, n) || n] = prop[n]
        }
        return el
    }
    function merge(obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i]
            for (var n in def) {
                if (obj[n] === undefined)
                    obj[n] = def[n]
            }
        }
        return obj
    }
    function getColor(color, idx) {
        return typeof color == 'string' ? color : color[idx % color.length]
    }
    var defaults = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        scale: 1.0,
        corners: 1,
        color: '#000',
        opacity: 1 / 4,
        rotate: 0,
        direction: 1,
        speed: 1,
        trail: 100,
        fps: 20,
        zIndex: 2e9,
        className: 'spinner',
        top: '50%',
        left: '50%',
        shadow: false,
        hwaccel: false,
        position: 'absolute'
    }
    function Spinner(o) {
        this.opts = merge(o || {}, Spinner.defaults, defaults)
    }
    Spinner.defaults = {}
    merge(Spinner.prototype, {
        spin: function(target) {
            this.stop()
            var self = this
              , o = self.opts
              , el = self.el = createEl(null, {
                className: o.className
            })
            css(el, {
                position: o.position,
                width: 0,
                zIndex: o.zIndex,
                left: o.left,
                top: o.top
            })
            if (target) {
                target.insertBefore(el, target.firstChild || null)
            }
            el.setAttribute('role', 'progressbar')
            self.lines(el, self.opts)
            if (!useCssAnimations) {
                var i = 0, start = (o.lines - 1) * (1 - o.direction) / 2, alpha, fps = o.fps, f = fps / o.speed, ostep = (1 - o.opacity) / (f * o.trail / 100), astep = f / o.lines;
                (function anim() {
                    i++
                    for (var j = 0; j < o.lines; j++) {
                        alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)
                        self.opacity(el, j * o.direction + start, alpha, o)
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
                }
                )()
            }
            return self
        },
        stop: function() {
            var el = this.el
            if (el) {
                clearTimeout(this.timeout)
                if (el.parentNode)
                    el.parentNode.removeChild(el)
                this.el = undefined
            }
            return this
        },
        lines: function(el, o) {
            var i = 0, start = (o.lines - 1) * (1 - o.direction) / 2, seg
            function fill(color, shadow) {
                return css(createEl(), {
                    position: 'absolute',
                    width: o.scale * (o.length + o.width) + 'px',
                    height: o.scale * o.width + 'px',
                    background: color,
                    boxShadow: shadow,
                    transformOrigin: 'left',
                    transform: 'rotate(' + ~~(360 / o.lines * i + o.rotate) + 'deg) translate(' + o.scale * o.radius + 'px' + ',0)',
                    borderRadius: (o.corners * o.scale * o.width >> 1) + 'px'
                })
            }
            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: 'absolute',
                    top: 1 + ~(o.scale * o.width / 2) + 'px',
                    transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
                    opacity: o.opacity,
                    animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
                })
                if (o.shadow)
                    ins(seg, css(fill('#000', '0 0 4px #000'), {
                        top: '2px'
                    }))
                ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
            }
            return el
        },
        opacity: function(el, i, val) {
            if (i < el.childNodes.length)
                el.childNodes[i].style.opacity = val
        }
    })
    function initVML() {
        function vml(tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
        }
        sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')
        Spinner.prototype.lines = function(el, o) {
            var r = o.scale * (o.length + o.width)
              , s = o.scale * 2 * r
            function grp() {
                return css(vml('group', {
                    coordsize: s + ' ' + s,
                    coordorigin: -r + ' ' + -r
                }), {
                    width: s,
                    height: s
                })
            }
            var margin = -(o.width + o.length) * o.scale * 2 + 'px', g = css(grp(), {
                position: 'absolute',
                top: margin,
                left: margin
            }), i
            function seg(i, dx, filter) {
                ins(g, ins(css(grp(), {
                    rotation: 360 / o.lines * i + 'deg',
                    left: ~~dx
                }), ins(css(vml('roundrect', {
                    arcsize: o.corners
                }), {
                    width: r,
                    height: o.scale * o.width,
                    left: o.scale * o.radius,
                    top: -o.scale * o.width >> 1,
                    filter: filter
                }), vml('fill', {
                    color: getColor(o.color, i),
                    opacity: o.opacity
                }), vml('stroke', {
                    opacity: 0
                }))))
            }
            if (o.shadow)
                for (i = 1; i <= o.lines; i++) {
                    seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')
                }
            for (i = 1; i <= o.lines; i++)
                seg(i)
            return ins(el, g)
        }
        Spinner.prototype.opacity = function(el, i, val, o) {
            var c = el.firstChild
            o = o.shadow && o.lines || 0
            if (c && i + o < c.childNodes.length) {
                c = c.childNodes[i + o];
                c = c && c.firstChild;
                c = c && c.firstChild
                if (c)
                    c.opacity = val
            }
        }
    }
    if (typeof document !== 'undefined') {
        sheet = (function() {
            var el = createEl('style', {
                type: 'text/css'
            })
            ins(document.getElementsByTagName('head')[0], el)
            return el.sheet || el.styleSheet
        }())
        var probe = css(createEl('group'), {
            behavior: 'url(#default#VML)'
        })
        if (!vendor(probe, 'transform') && probe.adj)
            initVML()
        else
            useCssAnimations = vendor(probe, 'animation')
    }
    return Spinner
}));
;var JSONH = function(Array, JSON) {
    "use strict";
    function hpack(list) {
        for (var length = list.length, keys = Object_keys(length ? list[0] : {}), klength = keys.length, result = Array(length * klength), i = 0, j = 0, ki, o; i < length; ++i) {
            for (o = list[i],
            ki = 0; ki < klength; result[j++] = o[keys[ki++]])
                ;
        }
        return concat.call([klength], keys, result);
    }
    function hunpack(hlist) {
        for (var length = hlist.length, klength = hlist[0], result = Array(((length - klength - 1) / klength) || 0), i = 1 + klength, j = 0, ki, o; i < length; ) {
            for (result[j++] = (o = {}),
            ki = 0; ki < klength; o[hlist[++ki]] = hlist[i++])
                ;
        }
        return result;
    }
    function iteratingWith(method) {
        return function iterate(item) {
            for (var path = this, current = item, i = 0, length = path.length, j, k, tmp; i < length; ++i) {
                if (isArray(tmp = current[k = path[i]])) {
                    j = i + 1;
                    current[k] = j < length ? map.call(tmp, method, path.slice(j)) : method(tmp);
                }
                current = current[k];
            }
            return item;
        }
        ;
    }
    function packOrUnpack(method) {
        return function parse(o, schema) {
            for (var wasArray = isArray(o), result = concat.call(arr, o), path = concat.call(arr, schema), i = 0, length = path.length; i < length; ++i) {
                result = map.call(result, method, path[i].split("."));
            }
            return wasArray ? result : result[0];
        }
        ;
    }
    function pack(list, schema) {
        return schema ? packSchema(list, schema) : hpack(list);
    }
    function unpack(hlist, schema) {
        return schema ? unpackSchema(hlist, schema) : hunpack(hlist);
    }
    function stringify(list, replacer, space, schema) {
        return JSON_stringify(pack(list, schema), replacer, space);
    }
    function parse(hlist, reviver, schema) {
        return unpack(JSON_parse(hlist, reviver), schema);
    }
    var arr = []
      , concat = arr.concat
      , Object_keys = Object.keys || function(o) {
        var keys = [], key;
        for (key in o)
            o.hasOwnProperty(key) && keys.push(key);
        return keys;
    }
      , isArray = Array.isArray || (function(toString, arrayToString) {
        arrayToString = toString.call(arr);
        return function isArray(o) {
            return toString.call(o) == arrayToString;
        }
        ;
    }({}.toString))
      , map = arr.map || function(callback, context) {
        for (var self = this, i = self.length, result = Array(i); i--; result[i] = callback.call(context, self[i], i, self))
            ;
        return result;
    }
      , packSchema = packOrUnpack(iteratingWith(hpack))
      , unpackSchema = packOrUnpack(iteratingWith(hunpack))
      , JSON_stringify = JSON.stringify
      , JSON_parse = JSON.parse;
    return {
        pack: pack,
        parse: parse,
        stringify: stringify,
        unpack: unpack
    };
}(Array, JSON);
;(function($, Drupal) {
    var Map = function(elm) {
        this.$elm = $(elm);
        this.$container = this.$elm.children('.block-mapboxblock__container');
        this.$locationList = this.$container.find('.block-mapboxblock__locations');
        this.$map = this.$container.find('.block-mapboxblock__map');
        this.$searchForm = this.$container.find('.block-mapboxblock__form');
        this.$searchInput = this.$searchForm.find('[type="text"]');
        this.$geolocateBtn = this.$map.find('.block-mapboxblock__map__geolocate-btn');
        this.$tabs = this.$container.find('.block-mapboxblock__tab');
        this.$messages = this.$container.find('.mapboxblock__list_messages');
        this.$errorContainer = this.$container.find('.mapboxblock-error');
        this.markerLayers = [];
        this.mapData = null;
        this.map_state = {
            center: {
                lat: null,
                lng: null
            },
            bounds: new mapboxgl.LngLatBounds(),
            zoom: null,
            query: null,
            geocode: {
                country: '',
                state: ''
            },
            search_type: null,
            padding: (this.$container.outerWidth() < 650) ? 6 : 3
        };
        this.isGeoLocate = false;
        this.isBeingDragged = false;
        this.isBeingZoomed = false;
        this.isBeingMoved = false;
        this.showDistance = false;
        this.settings = drupalSettings.mapboxBlock.custom;
        this.locationsData = [];
        this.scores_defaults = {
            text_variance_score: null,
            distance: null
        };
        this.allLocationsJsonURI = this.settings.jsonFilePath + '?' + Math.round(new Date().getTime() / 1000);
        if (!mapboxgl.accessToken) {
            mapboxgl.accessToken = this.settings.accessToken;
        }
        this.$searchForm.on('submit', $.proxy(function(e) {
            e.preventDefault();
            Map.prototype.toggleError(this.$errorContainer, false, '');
            this.map_state.query = '';
            var searchVal = this.$searchInput.val();
            if (searchVal.length > 0) {
                this.map_state.query = searchVal;
                this.scoreLocations();
                var feature = null;
                var locations = this.locationsData;
                locations = locations.sort(this.sortByTextVarianceScore);
                locations.forEach($.proxy(function(location) {
                    if (location.state.scores.text_variance_score === 0) {
                        feature = {
                            center: [location.lng, location.lat]
                        };
                    }
                }, this));
                if (feature === null) {
                    var error_msg = Drupal.t('Unable to find that address');
                    this.geocode(searchVal, $.proxy(function(features) {
                        if (features.length) {
                            feature = features[0];
                            this.applyFeature(feature);
                        } else {
                            Map.prototype.toggleError(this.$errorContainer, true, error_msg);
                        }
                    }, this), $.proxy(function(textStatus, error) {
                        Map.prototype.toggleError(this.$errorContainer, true, error_msg);
                    }, this));
                } else {
                    this.applyFeature(feature);
                }
            }
        }, this));
        this.$tabs.on('click', $.proxy(function(e) {
            e.preventDefault();
            var $link = $(e.target).closest('a');
            $link.addClass('active').siblings().removeClass('active');
            if ($link.hasClass('block-mapboxblock__tab--map')) {
                this.$map.removeClass('hide-for-small-only').insertBefore(this.$locationList);
            } else {
                this.$map.addClass('hide-for-small-only').appendTo(this.$container);
            }
            this.map.resize();
        }, this));
        $(window).on('changed.zf.mediaquery', $.proxy(function(event, newSize, oldSize) {
            if (oldSize === 'small') {
                this.$map.addClass('hide-for-small-only').appendTo(this.$container);
                this.map.resize();
            }
            if (newSize === 'small') {
                this.$map.removeClass('hide-for-small-only').insertBefore(this.$locationList);
            }
        }, this));
        this.$geolocateBtn.click(this, $.proxy(function(e) {
            e.preventDefault();
            Map.prototype.toggleError(this.$errorContainer, false, '');
            this.$searchInput.val('');
            this.showByGeolocation($.proxy(function() {}, true), $.proxy(function(errorMsg) {}, true));
        }, this));
        $('.mapbox-quicksearch').click(this, function(e) {
            e.preventDefault();
            var map = e.data;
            map.$searchInput.val($(this).attr('data-value'));
            $('#modal-location-chooser').foundation('close');
            map.$searchForm.submit();
        });
        this.map = new mapboxgl.Map({
            container: this.$map.attr('id'),
            style: this.settings.style,
            center: [-98, 38.88],
            zoom: 2,
            maxZoom: 16,
            minZoom: 1,
            scrollZoom: true,
            boxZoom: false,
            dragRotate: false,
            dragPan: true
        });
        this.map.addControl(new mapboxgl.NavigationControl());
        this.popup = new mapboxgl.Popup({
            closeButton: true,
            offset: 30
        });
        this.map.on('load', $.proxy(this.onLoad, this));
        this.map.on('click', 'markers-active', $.proxy(function(e) {
            var pointFeatures = this.map.queryRenderedFeatures(e.point, {
                layers: ['markers-active']
            });
            if (pointFeatures.length) {
                var feature = pointFeatures[0];
                var location = this.getLocationDetailsByNid(feature.properties.nid);
                this.popup.setLngLat(feature.geometry.coordinates).setHTML(this.themeClubPopup(location)).addTo(this.map);
            }
        }, this));
        this.map.on('movestart', $.proxy(function() {
            this.debugEvents('movestart');
            this.isBeingMoved = true;
            this.preRefreshData();
        }, this));
        this.map.on('moveend', $.proxy(function() {
            this.debugEvents('moveend');
            this.isBeingMoved = false;
            this.postRefreshData();
        }, this));
        this.map.on('dragstart', $.proxy(function() {
            this.debugEvents('dragstart');
            this.isBeingDragged = true;
            this.preRefreshData();
        }, this));
        this.map.on('dragend', $.proxy(function() {
            this.debugEvents('dragend');
            this.isBeingDragged = false;
            this.resetLocationsStates();
            this.map_state.search_type = '';
            this.postRefreshData();
        }, this));
        this.map.on('zoomstart', $.proxy(function() {
            this.debugEvents('zoomstart');
            this.isBeingZoomed = true;
            this.preRefreshData();
        }, this));
        this.map.on('zoomend', $.proxy(function() {
            this.debugEvents('zoomend');
            this.isBeingZoomed = false;
            this.postRefreshData();
        }, this));
    };
    Map.prototype.debugEvents = function(caller) {}
    ;
    Map.prototype.onLoad = function() {
        $.ajax({
            dataType: "text",
            url: this.allLocationsJsonURI,
            data: {},
            success: $.proxy(function(data) {
                var data_result = JSONH.parse(data);
                var data_final = [];
                var data_item = null;
                for (var d = 0; d < data_result.length; d++) {
                    data_item = data_result[d];
                    if (!data_item.lat || !data_item.lng) {
                        continue;
                    }
                    data_final.push(data_item);
                }
                this.locationsData = data_final;
                this.resetLocationsStates();
                this.map.loadImage(this.settings.markerIcon, $.proxy(function(error, image) {
                    this.map.addImage('custom-marker', image);
                    this.mapData = this.convertToGeoJson(this.locationsData);
                    this.map.addSource('locations', {
                        type: 'geojson',
                        data: this.mapData,
                        cluster: false,
                        clusterMaxZoom: 14,
                        clusterRadius: 5
                    });
                    this.buildMarkers();
                    if (this.$container.outerWidth() < 650) {
                        this.$map.removeClass('hide-for-small-only').insertBefore(this.$locationList);
                    }
                    setTimeout($.proxy(function() {
                        if (this.getHash() === 'nearby') {
                            this.showByGeolocation(function() {}, function(errorMsg) {
                                console.log(errorMsg);
                            });
                        } else {
                            var q = this.getQueryParam('q');
                            if (q && q.length > 0) {
                                q = q.replace(/\+/g, '%20');
                                q = decodeURIComponent(q);
                                this.$searchInput.val(q);
                            }
                            if (this.$searchInput.val().length > 0) {
                                this.$searchForm.trigger('submit');
                            } else {
                                this.fitMapToAllLocations();
                            }
                        }
                    }, this), 500);
                }, this));
            }, this)
        });
    }
    ;
    Map.prototype.buildMarkers = function() {
        var active = 'markers-active';
        this.markerLayers = [];
        if (typeof this.map.getLayer(active) !== 'undefined') {
            this.map.removeLayer(active);
        }
        var layoutActive = {
            'icon-image': 'custom-marker',
            'icon-padding': 0,
            'icon-allow-overlap': true,
            'icon-anchor': 'bottom',
            'icon-size': {
                "stops": [[0, 0.1], [4, 0.3], [8, 0.9]]
            }
        };
        this.map.addLayer({
            id: active,
            type: 'symbol',
            source: 'locations',
            layout: layoutActive
        });
        this.markerLayers.push(active);
    }
    ;
    Map.prototype.buildLocationList = function() {
        this.$locationList.html('');
        var resultsTitle = '';
        var resultsText = '';
        if (this.map.getZoom() >= 5) {
            var locations_match = [];
            var locations_distance = [];
            var locations_displayed_nids = [];
            var locations = this.locationsData;
            locations.forEach($.proxy(function(location) {
                if (location.state.is_shown) {
                    if (location.state.scores.text_variance_score !== null && location.state.scores.text_variance_score <= 15) {
                        locations_match.push(location);
                        locations_displayed_nids.push(location.nid);
                    } else if (location.state.scores.distance !== null) {
                        locations_distance.push(location);
                        locations_displayed_nids.push(location.nid);
                    }
                }
            }, this));
            this.getActiveFeatures().forEach($.proxy(function(feature) {
                var prop = feature.properties;
                if (locations_displayed_nids.indexOf(prop.nid) === -1) {
                    var location = this.getLocationDetailsByNid(prop.nid);
                    locations_distance.push(location);
                    locations_displayed_nids.push(location.nid);
                }
            }, this));
            var location_sequence = 1;
            var location_sequence_nids = [];
            if (locations_match.length > 0) {
                this.applyLocationListGroupLabel(Drupal.t('Best Matching Clubs'));
                if (this.map_state.search_type === 'address') {
                    locations_match.sort(this.sortByTextVarianceScoreByDistance);
                } else {
                    locations_match.sort(this.sortByTitle);
                }
                locations_match.forEach($.proxy(function(location) {
                    this.applyLocationListItem(location, location_sequence);
                    location_sequence_nids.push({
                        nid: location.nid,
                        sequence: location_sequence
                    });
                    location_sequence++;
                }, this));
            }
            if (locations_distance.length > 0) {
                this.applyLocationListGroupLabel(Drupal.t('Nearby Clubs'));
                if (this.map_state.search_type === 'address') {
                    locations_distance = locations_distance.sort(this.sortByDistance);
                } else {
                    locations_distance = locations_distance.sort(this.sortByTitle);
                }
                locations_distance = locations_distance.slice(0, 100);
                locations_distance.forEach($.proxy(function(location) {
                    this.applyLocationListItem(location, location_sequence);
                    location_sequence_nids.push({
                        nid: location.nid,
                        sequence: location_sequence
                    });
                    location_sequence++;
                }, this));
            }
            this.mapData.features.forEach($.proxy(function(map_feature) {
                map_feature.properties.sequence = '';
                location_sequence_nids.forEach($.proxy(function(location_sequence_nid) {
                    if (location_sequence_nid.nid === map_feature.properties.nid) {
                        map_feature.properties.sequence = location_sequence_nid.sequence;
                    }
                }, this));
            }, this));
            this.map.getSource('locations').setData(this.mapData);
            var $results_locations = this.$locationList.find('> .location');
            var results_count = $results_locations.length;
            if (results_count === 0) {
                resultsTitle = Drupal.t('No Clubs Found');
                resultsText = Drupal.t('There are no gyms near this location');
            } else if ((results_count > 0) && this.isGeoLocate) {
                resultsTitle = Drupal.t('Your Nearest Club');
                resultsText = '';
            }
        } else {
            this.mapData.features.forEach($.proxy(function(map_feature) {
                map_feature.properties.sequence = '';
            }, this));
            this.map.getSource('locations').setData(this.mapData);
        }
        this.$locationList.parents('.block-mapboxblock__results').scrollTop(0);
        this.setResultsMessages(resultsTitle, resultsText);
    }
    ;
    Map.prototype.applyFeature = function(feature) {
        if (feature !== null) {
            this.map_state.search_type = '';
            this.map_state.geocode.country = '';
            this.map_state.geocode.state = '';
            if (feature.hasOwnProperty('place_type') && (feature.place_type[0].indexOf('region') >= 0 || feature.place_type[0].indexOf('country') >= 0)) {
                this.showByFeaturePlaceType(feature);
            } else {
                this.showByAddress(feature);
            }
        }
    }
    ;
    Map.prototype.applyLocationListGroupLabel = function(message) {
        var item = document.createElement('li');
        var $item = $(item);
        $item.addClass('list-label');
        $item.html('<h6>' + message + '</h6>');
        $(this.$locationList).append($item);
    }
    ;
    Map.prototype.applyLocationListItem = function(location, location_sequence) {
        var item = document.createElement('li');
        var $item = $(item);
        $item.attr('data-nid', location.nid);
        $item.attr('data-sequence', location_sequence);
        $item.addClass('location');
        $item.html(this.themeClubListing(location, location_sequence));
        $(this.$locationList).append($item);
        $item.mouseover($.proxy(function() {
            var coords = new mapboxgl.LngLat(location.lng,location.lat);
            this.popup.setLngLat(coords).setHTML(this.themeClubPopup(location, location_sequence)).addTo(this.map);
        }, this));
        $item.mouseout($.proxy(function() {
            this.popup.remove();
        }, this));
    }
    ;
    Map.prototype.preRefreshData = function() {
        this.popup.remove();
    }
    ;
    Map.prototype.postRefreshData = function() {
        if (this.isBeingZoomed || this.isBeingDragged || this.isBeingMoved) {
            return;
        }
        var rebuild = false;
        if (this.map_state.center.lat === null) {
            rebuild = true;
        } else {
            if (this.map_state.zoom !== this.map.getZoom()) {
                rebuild = true;
            } else {
                var center = this.map.getCenter();
                if (Math.abs(center.lat - this.map_state.center.lat) > 0.05 || Math.abs(center.lng - this.map_state.center.lng) > 0.05) {
                    rebuild = true;
                }
            }
        }
        if (rebuild) {
            this.buildLocationList();
            this.map_state.center = this.map.getCenter();
            this.map_state.zoom = this.map.getZoom();
        }
        this.updateUrl();
        this.isGeoLocate = false;
    }
    ;
    Map.prototype.setResultsMessages = function(resultsTitle, resultsText) {
        if (resultsTitle.length > 0) {
            this.$messages.css({
                "visibility": "visible"
            });
        } else {
            this.$messages.css({
                "visibility": "hidden"
            });
        }
        this.$messages.find('.block-mapboxblock__results-title').html(resultsTitle);
        this.$messages.find('.block-mapboxblock__results-text').html(resultsText + '&nbsp;');
    }
    ;
    Map.prototype.showByGeolocation = function(success, error) {
        this.preRefreshData();
        this.toggleSpinner(true);
        this.setResultsMessages(Drupal.t('Searching...'), '');
        Drupal.pfMapServices.getGeolocation($.proxy(function(position) {
            if (position) {
                this.isGeoLocate = true;
                this.applyFeature({
                    center: [position.coords.longitude, position.coords.latitude]
                });
                this.toggleSpinner(false);
                success();
            }
        }, this), $.proxy(function(errorMsg) {
            this.isGeoLocate = false;
            this.toggleSpinner(false);
            error(errorMsg);
            this.setResultsMessages(Drupal.t('Unable to find your location'), Drupal.t('Enter an address above'));
        }, this));
    }
    ;
    Map.prototype.showByAddress = function(feature) {
        this.preRefreshData();
        this.setResultsMessages(Drupal.t('Searching...'), '');
        this.map_state.search_type = 'address';
        this.map_state.center.lat = feature.center[1];
        this.map_state.center.lng = feature.center[0];
        this.resetLocationsStates();
        this.scoreLocations();
        var locations = this.locationsData;
        var locations_displayed = [];
        locations.sort(this.sortByTextVarianceScore);
        if (locations[0].state.scores.text_variance_score === 0) {
            this.map_state.center.lat = locations[0].lat;
            this.map_state.center.lng = locations[0].lng;
            this.scoreLocations();
        }
        var threshold = 3;
        var radius_a = (this.settings.distanceUnits.toLowerCase() === 'm') ? 30 : (30 * 1.6);
        var radius_b = (this.settings.distanceUnits.toLowerCase() === 'm') ? 50 : (50 * 1.6);
        var locations_close = [];
        locations.sort(this.sortByDistance);
        locations.forEach($.proxy(function(location) {
            if (location.state.scores.distance <= parseInt(radius_a)) {
                locations_close.push(location);
            } else {
                if (locations_close.length <= threshold && location.state.scores.distance <= parseInt(radius_b)) {
                    locations_close.push(location);
                }
            }
        }, this));
        locations_displayed = locations_close;
        locations_displayed.forEach($.proxy(function(location) {
            location.state.is_shown = true;
        }, this));
        this.fitMapToShownLocations();
    }
    ;
    Map.prototype.showByFeaturePlaceType = function(feature) {
        this.preRefreshData();
        this.setResultsMessages(Drupal.t('Searching...'), '');
        this.map_state.search_type = 'place';
        this.map_state.center.lat = feature.center[1];
        this.map_state.center.lng = feature.center[0];
        this.resetLocationsStates();
        var locations = this.locationsData;
        var short_code_parts = feature.properties.short_code.split('-');
        var locations_displayed = [];
        locations.forEach($.proxy(function(location) {
            switch (feature.place_type[0]) {
            case 'country':
                if (feature.properties.short_code.toLowerCase() === location.address.cc.toLowerCase()) {
                    locations_displayed.push(location);
                    this.map_state.geocode.country = feature.properties.short_code.toLowerCase();
                }
                break;
            case 'region':
                var whitelist = [];
                if (short_code_parts.length > 1) {
                    whitelist = ['us', 'ca'];
                    if (whitelist.indexOf(short_code_parts[0].toLowerCase()) >= 0) {
                        if (short_code_parts[1].toLowerCase() === location.address.state.toLowerCase()) {
                            locations_displayed.push(location);
                            this.map_state.geocode.country = short_code_parts[0].toLowerCase();
                            this.map_state.geocode.state = short_code_parts[1].toLowerCase();
                        }
                    }
                } else {
                    whitelist = ['pr'];
                    if (whitelist.indexOf(feature.properties.short_code.toLowerCase()) >= 0) {
                        if (feature.properties.short_code.toLowerCase() === location.address.state.toLowerCase()) {
                            locations_displayed.push(location);
                            this.map_state.geocode.country = feature.properties.short_code.toLowerCase();
                        }
                    }
                }
                break;
            }
        }, this));
        locations_displayed.forEach($.proxy(function(location) {
            location.state.is_shown = true;
        }, this));
        this.scoreLocations();
        this.fitMapToShownLocations();
    }
    ;
    Map.prototype.fitMapToAllLocations = function() {
        if (this.locationsData.length > 0) {
            this.map_state.bounds = new mapboxgl.LngLatBounds();
            this.locationsData.forEach($.proxy(function(e) {
                var lat = parseFloat(e.lat);
                var lng = parseFloat(e.lng);
                var coords = [lng, lat];
                this.map_state.bounds.extend(coords);
            }, this));
            this.map.setCenter(this.map_state.bounds.getCenter());
            this.map.fitBounds(this.map_state.bounds, {
                linear: false,
                padding: this.map_state.padding
            });
        }
    }
    ;
    Map.prototype.fitMapToShownLocations = function() {
        var refit = false;
        this.map_state.bounds = new mapboxgl.LngLatBounds();
        this.locationsData.forEach($.proxy(function(location) {
            if (location.state.is_shown) {
                this.map_state.bounds.extend([parseFloat(location.lng), parseFloat(location.lat)]);
                refit = true;
            }
        }, this));
        if (refit) {
            this.map.setCenter(this.map_state.bounds.getCenter());
            this.map.fitBounds(this.map_state.bounds, {
                linear: true,
                padding: this.map_state.padding
            });
        }
    }
    ;
    Map.prototype.convertToGeoJson = function(data) {
        var features = [];
        data.forEach($.proxy(function(location) {
            features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [location.lng, location.lat]
                },
                properties: {
                    nid: location.nid,
                    label: '',
                    type: 'club',
                    description: '',
                    sequence: ''
                }
            });
        }, this));
        return {
            type: 'FeatureCollection',
            features: features
        };
    }
    ;
    Map.prototype.computeDistance = function(lat1, long1, lat2, long2, units) {
        if (isNaN(lat1) || isNaN(long1) || isNaN(lat2) || isNaN(long2) || units === undefined) {
            return null;
        }
        var radius = 3959.0;
        switch (units.toLowerCase()) {
        case 'k':
            radius = 6378.1;
            break;
        }
        var radianLat1 = (lat1 * (Math.PI / 180));
        var radianLong1 = (long1 * (Math.PI / 180));
        var radianLat2 = (lat2 * (Math.PI / 180));
        var radianLong2 = (long2 * (Math.PI / 180));
        var radianDistanceLat = radianLat1 - radianLat2;
        var radianDistanceLong = radianLong1 - radianLong2;
        var sinLat = Math.sin(radianDistanceLat / 2.0);
        var sinLong = Math.sin(radianDistanceLong / 2.0);
        var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLong, 2.0);
        return radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
    }
    ;
    Map.prototype.computeEditDistance = function(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        var costs = [];
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
                if (i === 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }
    ;
    Map.prototype.sortByTitle = function(a, b) {
        var x = a.title;
        var y = b.title;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    ;
    Map.prototype.sortByDistance = function(a, b) {
        var x = a.state.scores.distance;
        var y = b.state.scores.distance;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    ;
    Map.prototype.sortByTextVarianceScore = function(a, b) {
        var x = a.state.scores.text_variance_score;
        var y = b.state.scores.text_variance_score;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    ;
    Map.prototype.sortByTextVarianceScoreByDistance = function(a, b) {
        var tvs_a = a.state.scores.text_variance_score;
        var tvs_b = b.state.scores.text_variance_score;
        var d_a = a.state.scores.distance;
        var d_b = b.state.scores.distance;
        if (tvs_a === tvs_b) {
            return ((d_a < d_b) ? -1 : ((d_a > d_b) ? 1 : 0));
        }
        return ((tvs_a < tvs_b) ? -1 : ((tvs_a > tvs_b) ? 1 : 0));
    }
    ;
    Map.prototype.getHash = function() {
        var hash = window.location.href.split("#")[1] || "";
        hash = $.trim(hash);
        hash = decodeURIComponent(hash);
        return hash;
    }
    ;
    Map.prototype.getUniqueFeatures = function(array, comparatorProperty) {
        var existingFeatureKeys = {};
        return array.filter(function(el) {
            if (existingFeatureKeys[el.properties[comparatorProperty]]) {
                return false;
            } else {
                existingFeatureKeys[el.properties[comparatorProperty]] = true;
                return true;
            }
        });
    }
    ;
    Map.prototype.getActiveFeatures = function() {
        var features = this.map.queryRenderedFeatures({
            layers: ['markers-active']
        });
        return this.getUniqueFeatures(features, 'nid');
    }
    ;
    Map.prototype.getLocationDetailsByNid = function(nid) {
        var location = null;
        for (var l = 0; l < this.locationsData.length; l++) {
            if (parseInt(this.locationsData[l].nid) === parseInt(nid)) {
                location = this.locationsData[l];
                break;
            }
        }
        return location;
    }
    ;
    if (typeof Object.assign != 'function') {
        Object.assign = function(target) {
            'use strict';
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        }
        ;
    }
    Map.prototype.resetLocationsStates = function() {
        this.locationsData.forEach($.proxy(function(location) {
            location.state = {
                is_shown: false,
                scores: Object.assign({}, this.scores_defaults)
            };
        }, this));
    }
    ;
    Map.prototype.scoreLocations = function() {
        this.locationsData.forEach($.proxy(function(location) {
            var scores = Object.assign({}, this.scores_defaults);
            scores.distance = this.computeDistance(this.map_state.center.lat, this.map_state.center.lng, location.lat, location.lng, this.settings.distanceUnits);
            var text_variance_score = 100;
            var searchVal = this.map_state.query;
            if (searchVal !== null && searchVal.length > 0) {
                var pattern = /[^A-Za-z0-9 ]/g;
                searchVal = (searchVal.trim()).replace(pattern, '').toLowerCase();
                var club_title = (location.title).trim().replace(pattern, '').toLowerCase();
                var club_location = (location.address.city + ' ' + location.address.state).trim().replace(pattern, '').toLowerCase();
                var club_zipcode = (location.address.zip).trim();
                if (searchVal === club_title || searchVal === club_location || searchVal === club_zipcode) {
                    text_variance_score = 0;
                } else if (this.map_state.geocode.state === location.address.state.toLowerCase()) {
                    text_variance_score = 15;
                } else {
                    var parts = searchVal.split(' ');
                    parts.forEach($.proxy(function(part) {
                        if (part.length === 2) {
                            return false;
                        }
                        if (club_title.indexOf(part) > -1 || club_location.indexOf(part) > -1) {
                            text_variance_score = 20;
                        }
                    }, this));
                    if (text_variance_score === 100) {
                        var club_distance_name = this.computeEditDistance(searchVal, club_title);
                        var club_distance_location = this.computeEditDistance(searchVal, club_location);
                        var min_edit_distance = Math.min(club_distance_name, club_distance_location);
                        if (min_edit_distance < 5) {
                            text_variance_score = 30;
                        }
                    }
                }
            }
            scores.text_variance_score = text_variance_score;
            location.state.scores = scores;
        }, this));
    }
    ;
    Map.prototype.getQueryParam = function(id) {
        var url = baseURL = window.location.href;
        var value = null;
        if (url.indexOf('?') >= 0) {
            var urlParts = url.split('?');
            var pairs = urlParts[1].split('&');
            for (var i = 0; i < pairs.length; i++) {
                if (pairs[i].indexOf('=') >= 0) {
                    var keyVal = pairs[i].split('=');
                    if (keyVal[0] === id) {
                        value = keyVal[1];
                    }
                }
            }
        }
        return value;
    }
    ;
    Map.prototype.toggleError = function($errorContainer, isOn, message) {
        if (isOn) {
            $errorContainer.show(200, function() {
                $(this).addClass('on').find('.error-text').html(message)
            });
        } else {
            $errorContainer.hide(200, function() {
                $(this).find('.error-text').html('').removeClass('on');
            });
        }
    }
    ;
    Map.prototype.toggleSpinner = function(isOn) {
        if (isOn) {
            this.spinner = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            }).setLngLat(this.map.getCenter()).setHTML('<i class="fa fa-spin fa-spinner map-spinner"></i>').addTo(this.map);
            $('.map-spinner').css({
                "display": 'inline-block'
            });
        } else {
            this.spinner.remove();
            $('.map-spinner').css({
                "display": ' none'
            });
        }
    }
    Map.prototype.updateUrl = function() {
        var url = baseURL = window.location.href;
        var query = {};
        var fragment = '';
        var data = this.$searchInput.data('mapboxblock-data') || {};
        var hash = this.getHash();
        if (hash.length > 0) {
            baseURL = url.replace('#' + hash, '');
        }
        if (url.indexOf('?') >= 0) {
            var urlParts = url.split('?');
            var pairs = urlParts[1].split('&');
            baseURL = urlParts[0];
            var blacklist = ['q'];
            for (var i = 0; i < pairs.length; i++) {
                if (pairs[i].indexOf('=') >= 0) {
                    var keyVal = pairs[i].split('=');
                    if (blacklist.indexOf(keyVal[0]) === -1) {
                        query[keyVal[0]] = keyVal[1];
                    }
                }
            }
        }
        var searchValue = this.$searchInput.val();
        if (searchValue.length > 0) {
            query['q'] = searchValue;
        } else {
            if (this.isGeoLocate) {
                fragment = 'nearby';
            }
        }
        var finalUrl = baseURL;
        if (Object.keys(query).length) {
            finalUrl += '?' + $.param(query);
        } else if (fragment.length > 0) {
            finalUrl += '#' + fragment;
        }
        history.pushState({}, '', finalUrl);
    }
    ;
    Map.prototype.geocode = function(searchValue, success, failure) {
        var types = 'country,region,postcode,district,place,locality,neighborhood,address';
        var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(searchValue) + '.json?limit=15&country=US,CA,DO,PA,MX&types=' + types + '&autocomplete=false&access_token=' + mapboxgl.accessToken;
        $.getJSON(url, {}).done(function(data) {
            var features = (data || {}).features || [];
            success(features);
        }).fail(function(jqxhr, textStatus, error) {
            failure(textStatus, error);
        });
    }
    ;
    Map.prototype.themeDistance = function(distance) {
        var distanceDisplay = '';
        if (distance > -1) {
            var distanceUnits = (this.settings.distanceUnits === 'M') ? Drupal.t('miles') : 'km';
            distanceDisplay = '<p class="location__distance"><strong>' + distance.toFixed(1) + '</strong> <span class="units">' + distanceUnits + '</span></p>';
        }
        return distanceDisplay;
    }
    ;
    Map.prototype.themeClubListing = function(location, location_sequence) {
        if (location === null || typeof location === 'undefined' || !location.hasOwnProperty('nid')) {
            return '';
        }
        var nid = location.nid;
        var title = location.title;
        var phoneDisplay = location.phone;
        var phoneTel = location.tel;
        var address1 = location.address.a1;
        var city = location.address.city;
        var state = location.address.state;
        var zipCode = location.address.zip;
        var country = location.address.cc;
        var joinText = Drupal.t('Join Now');
        var viewText = Drupal.t('View Club Details');
        var distanceDisplay = '';
        if (location.state.scores.distance !== null && this.map_state.search_type === 'address') {
            distanceDisplay = this.themeDistance(location.state.scores.distance);
        }
        var locale = this.getLocationLocale(location);
        var pathDetails = locale.paths.detail;
        var pathOffers = locale.paths.offers;
        var linkOffers = '';
        if (pathOffers.length > 0) {
            linkOffers = '<a class="button" href="' + pathOffers + '">' + joinText + '</a>';
        }
        var alerts = '';
        if (locale.alerts.emergency.length > 0) {
            alerts += '<p class="emergency"><i class="fa fa-exclamation-triangle"/> ' + locale.alerts.emergency + '</p>';
        }
        if (locale.alerts.message.length > 0) {
            alerts += '<p class="message"> ' + locale.alerts.message + '</p>';
        }
        if (locale.alerts.announcement.value.length > 0) {
            var requestTime = new Date();
            var startTime = new Date(locale.alerts.announcement.start);
            var endTime = new Date(locale.alerts.announcement.end);
            if (requestTime >= startTime && requestTime <= endTime) {
                alerts += '<p class="announcement">' + locale.alerts.announcement.value + '</p>';
            }
        }
        var html = '';
        html += '<span class="icon-map-box-pin"></span>';
        html += distanceDisplay;
        html += '<h4 class="location__title"><a href="' + pathDetails + '" hreflang="en">' + title + '</a></h4>';
        html += '<div class="location__phone"><a href="tel:' + phoneTel + '">' + phoneDisplay + '</a></div>';
        html += '<p class="address" translate="no">';
        html += '<span class="address-line1">' + address1 + '</span><br>';
        html += '<span class="locality">' + city + '</span>, <span class="administrative-area">' + state + '</span> <span class="postal-code">' + zipCode + '</span> ';
        html += '<span class="country">' + country + '</span>';
        html += '</p>';
        if (alerts.length > 0) {
            html += '<div class="location__alerts">' + alerts + '</div>';
        }
        html += '<div class="location__actions">';
        html += '<div class="location__join">' + linkOffers + '</div>';
        html += '<div class="location__link"><a href="' + pathDetails + '" hreflang="en">' + viewText + '</a></div>';
        html += '</div>';
        return html;
    }
    ;
    Map.prototype.getLocationLocale = function(location) {
        var locale = null;
        var locale_languages = Object.keys(location.locales);
        if (locale_languages.length > 1 && drupalSettings.path.currentLanguage) {
            if (location.locales.hasOwnProperty(drupalSettings.path.currentLanguage)) {
                locale = location.locales[drupalSettings.path.currentLanguage];
            }
        }
        if (locale === null) {
            var locale_key = locale_languages[0];
            locale = location.locales[locale_key];
        }
        return locale;
    }
    ;
    Map.prototype.themeClubPopup = function(location) {
        if (typeof location === 'undefined' || !location.hasOwnProperty('nid')) {
            return '';
        }
        var nid = location.nid;
        var title = location.title;
        var phoneDisplay = location.phone;
        var phoneTel = location.tel;
        var address1 = location.address.a1;
        var city = location.address.city;
        var state = location.address.state;
        var joinText = Drupal.t('Join Now');
        var locale = this.getLocationLocale(location);
        var pathDetails = locale.paths.detail;
        var pathOffers = locale.paths.offers;
        var linkOffers = '';
        if (pathOffers.length > 0) {
            linkOffers = '<a class="button button-join" href="' + pathOffers + '">' + joinText + '</a>';
        }
        var distanceDisplay = '';
        if (this.showDistance) {
            if (location.hasOwnProperty("distance") && location.distance > -1) {
                distanceDisplay = this.themeDistance(location.distance);
            }
        }
        var html = '';
        html += '<div class="location-popup" data-nid="' + nid + '">';
        html += '<h6 class="mapboxgl-popup-content__title"><a href="' + pathDetails + '" hreflang="en">' + title + '</a></h6>';
        html += '<div class="location__phone"><a href="tel:' + phoneTel + '">' + phoneDisplay + '</a></div>';
        html += '<p class="address" translate="no">';
        html += '<span class="address-line1">' + address1 + '</span><br>';
        html += '<span class="locality">' + city + '</span>, <span class="administrative-area">' + state + '</span><br>';
        html += '</p>';
        html += distanceDisplay;
        html += linkOffers;
        html += '</div>';
        return html;
    }
    ;
    Drupal.behaviors.mapboxBlock = {
        attach: function(context, settings) {
            $(context).find('.block-mapboxblock').once('mapboxBlockInit').each(function() {
                new Map(this);
            });
        }
    };
}
)(jQuery, Drupal);
;(function($, Drupal) {
    Drupal.behaviors.foundationTopBarActive = {
        attach: function(context, settings) {
            var $active_links = $(context).find('.top-bar .menu-item > a.is-active');
            if ($active_links.length) {
                $active_links.once('foundationTopBarActive').each(function() {
                    $(this).parent().addClass('active');
                });
            }
        }
    };
}
)(jQuery, Drupal);
;