/*
$('#search-field .typeahead').typeahead(null, {
  name: 'best-pictures',
  display: 'value',
  source: bestPictures,
  templates: {
    empty: [
      '<div class="empty-message">',
        'unable to find any Best Picture winners that match the current query',
      '</div>'
    ].join('\n'),
    suggestion: Handlebars.compile('<div><strong>{{value}}</strong> – {{year}}</div>')
  }
});
*/

function entry(r) {
    if (r.altLabel != "") {
        //return Handlebars.compile('<div>{{r.altLabel}} --> Use <string>{{r.prefLabel}}</strong></div>')
        return '<div>' + r.altLabel + ' --> Use <strong>' + r.prefLabel + '</strong></div>';
    } else {
        return '<div>' + r.prefLabel + '</div>';
    }
}
function t(response) {
    console.log(response)
    values = [];
    for (var i=0; i < response.results.length; i++) {
        var r = response.results[i]
        values.push(r);
    }
    console.log(values);
    return values
}
var suggestions = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: '/suggestions?q=%QUERY',
    wildcard: '%QUERY',
    transform: t
  }
});

$('#search-field .typeahead').typeahead(null, {
    minLength: 3,
    name: 'other',
    source: suggestions,
    display: 'prefLabel',
    templates: {
        empty: [
            '<div class="empty-message">',
                'unable to find any names that match the current query',
            '</div>'
        ].join('\n'),
        suggestion: entry
    }
});

$('#search-field .typeahead').bind('typeahead:open', function(ev) {
    $('#labelselected').val('false');
});

$('#search-field .typeahead').bind('typeahead:select', function(ev, selection) {
    console.log(selection);
    $('#labelselected').val('true');
});