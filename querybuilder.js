/*!
 * QueryBuilder.js
 * https://github.com/Futuring/QueryBuilder
 * MIT licensed
 *
 * Copyright (C) 2015 Futuring, http://futuring.com.br
 */

(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([], factory);
    } else if(typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.QueryBuilder = factory();
    }
}(this, function() {
    'use strict';
    function QueryBuilder() {
        var pub = {}, query = [];

        function _whereSugar (type, field, value) {
            var condition = {};
            condition[field] = {};
            condition[field][type] = value;
            return pub.where(condition);
        }

        pub.where = function () {
            var params = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                params.push(JSON.stringify(arguments[i]));
            }
            query.push({where: params.join(',')});
            return this;
        }

        pub.eq = _whereSugar.bind(this, 'eq');
        pub.neq = _whereSugar.bind(this, 'neq');
        pub.lt = _whereSugar.bind(this, 'lt');
        pub.lte = _whereSugar.bind(this, 'lte');
        pub.gt = _whereSugar.bind(this, 'gt');
        pub.gte = _whereSugar.bind(this, 'gte');
        pub.isNull = _whereSugar.bind(this, 'isNull');
        pub.in = _whereSugar.bind(this, 'in');
        pub.like = _whereSugar.bind(this, 'like');
        pub.between = _whereSugar.bind(this, 'between');

        pub.orderBy = function () {
            var params = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                params.push(JSON.stringify(arguments[i]));
            }
            query.push({orderBy: '[' + params.join(',') + ']'});
            return this;
        }

        pub.groupBy = function (param) {
            query.push({groupBy: param});
            return this;
        }

        pub.fields = function (param) {
            query.push({fields: param});
            return this;
        }

        pub.limit = function (param) {
            query.push({limit: param});
            return this;
        }

        pub.offset = function (param) {
            query.push({offset: param});
            return this;
        }

        pub.query = function (str) {
            var str = str || false, call = {}, group = {};
            for(var i = 0, l = query.length; i < l; i++){
                for(var key in query[i]){
                    if(group[key] === undefined){
                      group[key] = [];
                    }
                    group[key].push(query[i][key]);
                }
            }

            for(var key in group){
                var join = group[key].join(',');
                call[key] = key === 'where' ||  key === 'orderBy' ? '[' + join + ']' : join;
            }

            if(!str) return call;
            else {
                var queryString = [];
                for (var key in call){
                    queryString.push(key + '=' + call[key]);
                }
                return '?' + queryString.join('&');
            }
        }

        return pub;
    };
    return QueryBuilder;
}));
