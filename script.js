$(document).ready(function() {
    $.get("domains.json", function(data) {
        $(".scan").removeClass("disabled");
        $(".scan").click(function() {
            var domains = data.domains;
            var faileddomains = [];
            var cnt = 0;
            $(".count").html("0 / " + domains.length);
            $(".scanbutton").hide();
            $(".loadingbar").show();
            $.each(domains, function(i, data) {
                var image = new Image();
                image.setAttribute("domain", data.domain.replace("~", ""));
                image.setAttribute("title", data.title);
                image.onerror = function() {
                    cnt++;
                    $(".count").html(cnt + " / " + domains.length);
                    faileddomains.push({
                        "title": this.getAttribute("title"),
                        "domain": this.getAttribute("domain"),
                        "img": this.src
                    });
                    $(".bar").width(((cnt / domains.length) * 100) + '%');
                    $(".failedresults").fadeIn(500);
                    if (faileddomains.length == 1) {
                        $(".failed").html('1 domain could not be reached');
                    } else {
                        $(".failed").html(faileddomains.length + ' domains could not be reached');
                    }
                    if (cnt == domains.length) {
                        $(".loadingbar").fadeOut(500);
                    }
                    $(".table tbody").prepend("<tr><td>" + data.title + "<p class='right'><a href='javascript:void(0);' onclick=\"swal('" + data.title + "','<a target=_blank href=http://www." + data.domain + '/' + data.img + ">" + data.domain + "</a> could not be reached','error');\"><i class='info circle icon'></i></a></p></td></tr>");
                };

                image.onload = function() {
                    cnt++;
                    $(".count").html(cnt + " / " + domains.length);
                    $(".bar").width(((cnt / domains.length) * 100) + '%');
                    if (cnt == domains.length && faileddomains.length == 0) {
                        $(".loadingbar").fadeOut(500);
                        $(".successresults").fadeIn(500);
                    } else if (cnt == domains.length) {
                        $(".loadingbar").fadeOut(500);
                    }
                };
                if (data.domain.match("^~")) {
                    image.src = 'http://' + data.domain.replace("~", "") + '/' + data.img + '?no-cache=' + (new Date).getTime();
                } else {
                    image.src = 'http://www.' + data.domain + '/' + data.img + '?no-cache=' + (new Date).getTime();
                }
            });
        });
    }).fail(function() {
		swal('Connection error','The domains database could not be loaded','error');
	})
});