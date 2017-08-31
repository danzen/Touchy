
var app = function(app) {

    app.makeControls = function(v,p) {

        var blob = v.blob;
        var logo = v.logo;
        var play = v.page1.play;

        Ticker.add(function() {
            blob.update();
        });

        function goToPage1() {
            p.go(v.page1, "left", "clear", 1000);
            logo.animate({
                obj:{y:logo.startY},
                time:800,
                wait:200,
                ease:"backOut"
            });
            timeout(300, function() {
                blob.alpha = 0;
                blob.color = frame.green;
                stopZimAnimate("blob");
                v.blogSet();
                blob.animate({
                    obj:{alpha:1},
                    time:800,
                    wait:300
                });
            });
        }

        function goToPage3() {
            logo.animate({
                obj:{y:stageH-logo.height},
                time:600,
            });
            timeout(100, function() {
                blob.alpha = 0;
                v.blobSet2();
            });
            timeout(500, function() {
                blob.alpha = 1;
                stage.update();
            });
        }

        // LOGO PRESS (forward from page 1 and back for other pages)

        logo.on("mousedown", function() {
            if (p.transitioning) return;
            if (p.page == v.page1) {
                goToPage2();
            } else if (p.page == v.page2) {
                goToPage1();
            } else if (p.page == v.page3) {
                p.go(v.page2, "left", "slide", 600);
            } else if (p.page == v.page5 || p.page == v.page6) {
                goToPage3();
                p.go(v.page3, "up", "slide", 600);
            }
        })

        // PAGE 1 to PAGE 2

        play.on("mousedown", goToPage2);

        function goToPage2() {
            blob.animate({
                obj:{alpha:0},
                time:500+700,
                call:function(){
                    v.blobSet2();
                    p.go(v.page2);
                    blob.alpha = 1;
                }
            });

            logo.animate({
                obj:[
                    {target:v.page1, obj:{alpha:0}},
                    {obj:{y:stageH-logo.height}, ease:"backIn", time:700}
                ],
                time:500,
                call:function() {
                    play.alpha = 1;
                }
            });
        }

        // PAGE 2 to PAGE 3

        v.page2.next.on("mousedown", function() {
            p.go(v.page3, "right", "slide", 600);
        });

        // PAGE 3 to PAGE 4

        var counterInterval;
        v.page3.go.on("mousedown", function() {
            var outer = v.page4.outer;
            var inner = v.page4.inner;
            var score = v.page4.score;
            var time = v.page4.time;
            var header = v.page4.header;
            var footer = v.page4.footer;

            header.alpha = 0;
            footer.alpha = 0;
            outer.scale(0);
            inner.scale(0);
            score.text = 100;
            time.text = "0:20";
            p.go(v.page4);
            header.animate({obj:{alpha:1}, wait:500, time:500});
            footer.animate({obj:{alpha:1}, wait:500, time:500});
            outer.animate({obj:{scale:1}, time:600});
            inner.animate({
                obj:{scale:1},
                time:500,
                wait:400,
                call: function() {
                    var totalTime = 20;
                    interval(1000, function(obj) {
                        time.text = decimals((totalTime - obj.count)/100, 2, 2, 1, true, true);
                        if (obj.count == obj.total) {

                            // PAGE 4 to PAGE 5
                            blob.alpha = 1;
                            logo.alpha = 1;
                            logo.y = 0;
                            p.go(v.page5);
                            v.page5.score.text = score.text;
                            stage.update();
                        }
                        stage.update();
                    }, totalTime);
                }
            });
            blob.animate({
                obj:{y:"500"},
                time:500,
                call:function() {
                    stopZimAnimate("blob");
                    blob.alpha = 0;
                    v.blobSet3();
                }
            });
            logo.animate({
                obj:{y:"500"},
                time:500
            });

            // every 400 ms subtract the highest of 0, 1 or 2 points depending on circle status
            // that way if the center is pressed for 20 seconds you lose 100 points

            var pointers = {};

            stage.on("mousedown", updateCursor);
            stage.on("pressmove", updateCursor);
            stage.on("pressup", removeCursor);

            function updateCursor(e) {
                var id = "id"+Math.abs(e.pointerID+1);
                var distance = Math.sqrt(Math.pow(stageW/2-e.stageX, 2) + Math.pow(stageH/2-e.stageY, 2));
                if (distance <= inner.width/2) {
                    pointers[id] = 2;
                } else if (distance <= outer.width/2) {
                    pointers[id] = 1;
                } else {
                    delete pointers[id];
                }
                setColors();
            }

            function removeCursor(e) {
                var id = "id"+Math.abs(e.pointerID+1);
                delete pointers[id];
                setColors();
            }

            function setColors() {
                var val = 0;
                loop(pointers, function(id, amount) {
                    val = amount;
                    if (val == 2) return true; // exits the loop completely (like a break)
                });
                if (val == 0) {
                    outer.color = frame.green;
                    inner.color = frame.yellow;
                } else if (val == 1) {
                    outer.color = frame.pink;
                    inner.color = frame.yellow;
                } else if (val == 2) {
                    outer.color = frame.pink;
                    inner.color = frame.purple;
                }
            }

            if (counterInterval) counterInterval.clear();
            counterInterval = interval(400, function() {
                var val = 0;
                loop(pointers, function(id, amount) {
                    val = amount;
                    if (val == 2) return true; // exits the loop completely (like a break)
                });
                score.text = String(Number(score.text) - val);
            });

        });

        // PAGE 5 to PAGE 6

        v.page5.tabs.on("change", function(){
            var page5 = v.page5;
            var page6 = v.page6;
            var messages = ["CONGRATULATIONS!", "DIPLOMATIC!", "MAYBE NEXT TIME!"];
            var fields = ["wins", "ties", "losses"];
            app.updateData(fields[page5.tabs.selectedIndex]);
            page6.message.text = messages[page5.tabs.selectedIndex];
            page5.tabs.selectedIndex
            setDataFields();
            p.go(page6, "right", "slide", 600);
            page5.tabs.selectedIndex = -1;
        });

        function setDataFields() {
            v.page6.winsAmount.text = app.data.wins;
            v.page6.tiesAmount.text = app.data.ties;
            v.page6.lossesAmount.text = app.data.losses;
        }


        var cancel = new Button({width:220, height:100, label:"CANCEL", color:frame.grey, rollColor:frame.green, corner:0});
        var confirm = new Button({width:220, height:100, label:"CLEAR", color:frame.purple, rollColor:frame.green, corner:0});

        var pane;
        cancel.on("click", function() {
            pane.hide();
        });
        confirm.on("click", function() {
            app.clearData();
            setDataFields();
            pane.hide();
        });
        v.page6.clear.on("mousedown", function(){
            pane = new Pane({width:stageW*.85, height:stageW*.8/2, corner:0, color:frame.yellow, modal:true, displayClose:false});
            cancel.scaleTo(pane, 40).center(pane).mov(-pane.width*.45/2);
            confirm.scaleTo(pane, 40).center(pane).mov(pane.width*.45/2);
            pane.show();
        });

        v.page6.rate.on("mousedown", function(){
            // zgo("http://itunes.apple.com/app/touchy/id363872647","_blank");
            zgo("https://play.google.com/store/apps/details?id=com.danzen.touchy","_blank");
        });

        // PAGE 6 to PAGE 3

        v.page6.again.on("mousedown", function(){
            goToPage3();
            p.go(v.page3, "up", "slide", 600);
            zim.distill();
        });

    }

    return app;
}(app || {});
