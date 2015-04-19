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

        pub.eq = _.bind(_whereSugar, this, 'eq');
        pub.neq = _.bind(_whereSugar, this, 'neq');
        pub.lt = _.bind(_whereSugar, this, 'lt');
        pub.lte = _.bind(_whereSugar, this, 'lte');
        pub.gt = _.bind(_whereSugar, this, 'gt');
        pub.gte = _.bind(_whereSugar, this, 'gte');
        pub.isNull = _.bind(_whereSugar, this, 'isNull');
        pub.in = _.bind(_whereSugar, this, 'in');
        pub.like = _.bind(_whereSugar, this, 'like');
        pub.between = _.bind(_whereSugar, this, 'between');

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

        pub.query = function () {
            var call = {};
            var group =  _.groupBy(query, function(item){return _.keys(item)[0]});

            for(var key in group){
                console.dir(_.pluck(group[key], key))
            }

            for(var key in group){
                var pluck = _.pluck(group[key], key).join(',');
                call[key] = key === 'where' ||  key === 'orderBy' ? '[' + pluck + ']' : pluck;
            }

            return call;
        }

        return pub;
    };
    return QueryBuilder;
}));