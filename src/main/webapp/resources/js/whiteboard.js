jQuery(function() {
    var parentT = jQuery('#toolboxDialog').parent();
    parentT.css('left', parentT.offset().left - 10 + 'px');

    var parentP = jQuery('#propertiesDialog').parent();
    parentP.css('left', parentP.offset().left - 10 + 'px');
    parentP.css('top', parentP.offset().top - 10 + 'px');

    var parentM = jQuery('#monitoringDialog').parent();
    parentM.css('top', parentM.offset().top - 10 + 'px');
});

