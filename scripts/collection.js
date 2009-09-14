/*----------------------------------------------------------------------------
 * Collection Functionality
 *---------------------------------------------------------------------------*/
 
/**
 * @namespace
 * Namespace to hold functions dealing with collection querying and data loading
 */
Geodia.Collection = {
    SERVICE: "http://www.laits.utexas.edu/geodia/modules/geodia"
};

/**
 * @class
 * DASe Collection loader class
 *
 * @augments TimeMap.loaders.jsonp
 * @requires loaders/json.js
 *
 * @param {Object} options          All options for the loader:<pre>
 *   {String} url                       Full JSONP url of Flickr feed to load
 *   {Function} preloadFunction         Function to call on data before loading
 *   {Function} transformFunction       Function to call on individual items before loading
 */
TimeMap.loaders.dase = function() {
    var loader = new TimeMap.loaders.jsonp(options);
    
    /** 
     * Base URL of the service 
     * @type String
     */
    loader.SERVICE = "http://www.laits.utexas.edu/geodia/modules/geodia";
    
    /**
     * Retrieve a query with a list of cultures and regions
     * 
     * @param {String[]} cultures       List of cultures for the query
     * @param {String[]} regions        List of regions for the query
     * @param {TimeMapDataset} dataset  Dataset to load data into
     * @param {Function} callback       Function to call once data is loaded
     */
    loader.loadQuery = function(cultures, regions, dataset, callback) {
        // build query
        var url = loader.SERVICE + '/search.json?c=geodia&q=item_type:site_period';
        // add cultures
        if (cultures && cultures.length > 0) {
            url += ' AND parent_period:(';
            for (var x=0; x<cultures.length; x++) {
                url += cultures[x].replace('/','* OR ') + '* OR ';
            }
            url = url.substring(0,url.length - 4)+')';
        }
        // add regions
        if (regions && regions.length > 0) {
            url += ' AND parent_period:(';
            for (var x=0; x<regions.length; x++) {
                url += regions[x] + ' OR ';
            }
            url = url.substring(0,url.length - 4)+')';
        }
        // finish query URL
        url += '&max=999&auth=http&callback=';
        loader.url = escape(url);
        // XXX: This assumes that the URL is a straight JSONP call, 
        // not the double-call currently in use
        loader.load(dataset, callback);
    };
    
    /**
     * Retrieve a query with a search term
     * 
     * @param {String} term             Term to search on
     * @param {TimeMapDataset} dataset  Dataset to load data into
     * @param {Function} callback       Function to call once data is loaded
     */
    loader.loadSearch = function(term, dataset, callback) {
        term = term.toLowerCase();
        // build query
        var url = loader.SERVICE + '/search.json?c=geodia&q=' + term + '* NOT item_type:(image OR period)&max=999&callback=';
        loader.url = escape(url);
        // XXX: This assumes that the URL is a straight JSONP call, 
        // not the double-call currently in use
        loader.load(dataset, callback);
    };
    
    return loader;
};

// XXX: all of the loading functionality should be moved here
// Probably, this should work like one of the loader services,
// swappable for another service as needed