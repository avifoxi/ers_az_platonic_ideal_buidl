$( "#accordion" ).accordion({
	heightStyle: "content",
	beforeActivate: function(e, u) {
		if ($("#glossary_popup").is(":visible")) {
			$("#glossary_popup").fadeOut();
		}
	}
});