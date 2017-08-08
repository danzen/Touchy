
var app = function(app) {

    app.makeView = function(layoutManager) {
        var v = {};

        // BLOB AND LOGO ARE COMMON TO ALL PAGES (except the play page)

        // top left and top center point of blob
        var points = [
            [0,0, 0,0, 0,0],
            [stageW/2,0, 0,0, 0,0],
            [stageW/2,stageH/2, 0,-stageH/2.5, 0,stageH/2.5],
            [stageW/2,stageH, 0,0, 0,0],
            [0,stageH, 0,0, 0,0]
        ];
        var points2;

        // create the blob
        var blob = v.blob = new zim.Blob({
            color:frame.green,
		    points:points,
            showControls: false
        }).addTo(stage);

        var logo = v.logo = frame.asset("logo.jpg");
        logo.startY = stageH*.25;
        logo.addTo(stage).scaleTo(stage).pos(0, logo.startY);

        v.positionBlob = function(points, resize) { // handles positioning for all blobs (different points passed in)
            blob.y = 0;
            zim.loop(points, function(point, i) {
                if (resize && i == 2) return; // skip middle point - let wiggle handle it for resize
                blob.points[i][0].pos(point[0],point[1]);
            });
        }

        v.blogSet = function() { // setting blob when going to page 1
            blob.color = frame.green;
            v.positionBlob(points)
            blob.points[2][0].rotation = 0;
            v.blobWiggle();
        }

        v.blobSet2 = function() { // setting blob when going to page 2 or 3 (bottom)
            blob.color = "#333";
            v.positionBlob(points2)
            blob.points[2][0].rotation = -90;
            v.blobWiggle2();
        }

        v.blobSet3 = function() { // setting blob when going to page 5 or 6 (top)
            blob.color = "#333";
            v.positionBlob(points3)
            blob.points[2][0].rotation = 90;
            v.blobWiggle3();
        }

        v.blobWiggle = function() { // batched function for resize (and bobSet)
            wiggleSet = false;
            zim.stopZimAnimate("blob");
            blob.points[2][0].wiggle("rotation", 0, 20, 80, 3000, 10000, null, null, null, "blob");
            blob.points[2][0].wiggle("x", stageW/2, 20, 60, 3000, 10000, null, null, null, "blob");
            blob.points[2][0].wiggle("y", stageH/2, 20, 60, 3000, 10000, null, null, null, "blob");
        }

        v.blobWiggle2 = function() { // batched function for resize (and bobSet2)
            wiggleSet = false;
            zim.stopZimAnimate("blob");
            blob.points[2][0].wiggle("rotation", -90, 5, 15, 3000, 10000, null, null, null, "blob");
            blob.points[2][0].wiggle("x", stageW/2, 10, 60, 3000, 10000, null, null, null, "blob");
            blob.points[2][0].wiggle("y", stageH-logo.height-60, 10, 30, 3000, 10000, null, null, null, "blob");
        }

        v.blobWiggle3 = function() { // batched function for resize (and bobSet2)
            wiggleSet = false;
            zim.stopZimAnimate("blob");
            blob.points[2][0].wiggle("rotation", 90, 5, 15, 3000, 10000, null, null, null, "blob");
            blob.points[2][0].wiggle("x", stageW/2, 10, 60, 3000, 10000, null, null, null, "blob");
            blob.points[2][0].wiggle("y", logo.height+60, 10, 30, 3000, 10000, null, null, null, "blob");
        }

        var wiggleBatchTime = 200;
        var wiggleSet = true;
        zim.timeout(wiggleBatchTime, v.blobWiggle);

        v.scale = function (page) {
            points = [ // data to rearrange blob on secondary pages
                [0,0],
                [stageW/2,0],
                [stageW/2,stageH/2],
                [stageW/2,stageH],
                [0,stageH]
            ];
            points2 = [ // data to rearrange blob on secondary pages
                [0,stageH],
                [0,stageH-logo.height-60],
                [stageW/2,stageH-logo.height-60],
                [stageW,stageH-logo.height-60],
                [stageW,stageH]
            ];
            points3 = [ // data to rearrange blob on secondary pages
                [stageW,0],
                [stageW,logo.height+60],
                [stageW/2,logo.height+60],
                [0,logo.height+60],
                [0,0]
            ];
            if (page == page1) {
                logo.scaleTo(stage).pos(0,stageH*.2);
                v.positionBlob(points, true);
                if (!wiggleSet) {
                    wiggleSet = true;
                    zim.timeout(wiggleBatchTime, v.blobWiggle);
                }
            } else if (page == page2 || page == page3) {
                logo.scaleTo(stage).pos(0,stageH-logo.height);
                v.positionBlob(points2, true);
                if (!wiggleSet) {
                    wiggleSet = true;
                    zim.timeout(wiggleBatchTime, v.blobWiggle2);
                }
            } else if (page == page5 || page == page6) {
                logo.scaleTo(stage).pos(0,0);
                v.positionBlob(points3, true);
                if (!wiggleSet) {
                    wiggleSet = true;
                    zim.timeout(wiggleBatchTime, v.blobWiggle3);
                }
            }
            // handle batch wiggle delayed update so resize does not keep triggering wiggle change
        }
        v.scale();



        ////////////////   PAGE 1  //////////////////

        var page1 = v.page1 = new zim.Container();

        var play = page1.play = new zim.Button({
            color:frame.pink,
            label:new zim.Label({
                text:"PLAY",
                color:"white"
            }),
            corner:0
        }).addTo(page1);

        var tagline = page1.tagline = new zim.Label({
            text:"THE MODERN TWISTER",
            color:"white",
            align:"center",
            fontOptions: "italic"
        }).addTo(page1);


        var layout = new zim.Layout({
            holder:page1,
            regions:[
                {object:play, marginTop:55, maxWidth:50, align:"center"},
                {object:tagline, marginTop:5, height:30, maxWidth:50, valign:"top"}
            ],
            scalingObject:stage,
            // regionShape:new zim.Shape()
        });
        layoutManager.add(layout);


        ////////////////   PAGE 2  //////////////////

        var page2 = v.page2 = new zim.Container(600, 800);

        var text = "Touch and hold\n";
        text+= "the target on your\n";
        text+= "opponent's screen\n";
        text+= "to take away\n";
        text+= "their points";

        var label = new zim.Label({
            text:text,
            color:"white",
            align:"center",
            fontOptions: "italic"
        }).addTo(page2).expand();

        var next = page2.next = new zim.Button({
            label:"NEXT",
            color:frame.pink,
            corner:0
        }).addTo(page2);

        var layout2 = new zim.Layout({
            holder:page2,
            regions:[
                {object:label, marginTop:18, maxWidth:80, height:25, align:"center", valign:"bottom"},
                {object:next, marginTop:5, height:52, maxWidth:50, valign:"top"}
            ],
            scalingObject:stage,
            // regionShape:new zim.Shape()
        });
        layoutManager.add(layout2);


        ////////////////   PAGE 3  //////////////////

        var page3 = v.page3 = new zim.Container();

        text = "Press the\n";
        text+= "GO BUTTON\n";
        text+= "at the same time\n";
        text+= "to sync play!\n";

        var label2 = new zim.Label({
            text:text,
            color:"white",
            align:"center",
            fontOptions: "italic"
        }).addTo(page3).expand();

        var go = page3.go = new zim.Button({
            label:"GO",
            color:frame.pink,
            corner:50,
            width:100,
            height:100
        }).addTo(page3).expand();

        var layout3 = new zim.Layout({
            holder:page3,
            regions:[
                {object:label2, marginTop:18, maxWidth:80, height:25, align:"center", valign:"bottom"},
                {object:go, marginTop:0, height:57, maxWidth:25, valign:"top"}
            ],
            scalingObject:stage,
            // regionShape:new zim.Shape()
        });
        layoutManager.add(layout3);


        ////////////////   PAGE 4  //////////////////

        var page4 = v.page4 = new zim.Container();

        var header = page4.header = new zim.Container(600, 100)
            .addTo(page4);
        var protect = new zim.Label({
            text:"PROTECT YOUR TARGET\nFOR A HIGHER SCORE",
            color:"white",
        }).centerReg(header);
        protect.pos(protect.width/2);

        var score = page4.score = new zim.Label({
            text:"100",
            color:"white",
            size:50,
            backing:new zim.Rectangle(130, 100, "rgba(0,0,0,.2)")
        }).addTo(header).pos(header.width-130);


        var circles = new zim.Container()
            .addTo(page4);
        var outer = page4.outer = new zim.Circle(stageW*.95/2, frame.green, "rgba(0,0,0,.2)", 1, false)
            .addTo(circles).expand(600);
        var inner = page4.inner = new zim.Circle(stageW*.5/2, frame.yellow, "rgba(0,0,0,.2)", 1, false)
            .addTo(circles);

        var footer = v.page4.footer = new zim.Container(600, 100)
            .addTo(page4);
        var time = page4.time = new zim.Label({
            text:"0:20",
            color:"white",
            size:75
        }).center(footer);

        var layout4 = new zim.Layout({
            holder:page4,
            regions:[
                {object:header, marginTop:2, maxWidth:90, align:"center", valign:"center"},
                {object:circles, maxWidth:98, marginTop:1, valign:"center"},
                {object:footer, maxWidth:90, marginTop:1, valign:"center"}
            ],
            lastMargin:2,
            scalingObject:stage,
            // regionShape:new zim.Shape()
        });
        layoutManager.add(layout4);



        ////////////////   PAGE 5  //////////////////

        var page5 = v.page5 = new zim.Container();

        var details = new zim.Container(500,420).addTo(page5);

        // new zim.Guide(details, false);
        var heightAdjust = 68;

        var label3 = new zim.Label({
            text:"YOUR SCORE:",
            color:"white"
        }).center(details).pos(null, heightAdjust);

        var score2 = page5.score = new zim.Label({
            text:"100",
            color:"white",
            size:50,
            backing:new zim.Rectangle(130, 100, "rgba(0,0,0,.3)")
        }).center(details).pos(null, label3.y + label3.height + 30);

        var label4 = new zim.Label({
            text:"DID YOU:",
            color:"white"
        }).center(details).pos(null, score2.y + score2.height + 60);

        var tabs = page5.tabs = new zim.Tabs({
            width:500,
            spacing:10,
            rollColor:frame.orange,
            color:frame.pink,
            offColor:frame.pink,
            tabs:["WIN", "TIE", "LOSE"]
        }).center(details).pos(null, label4.y + label4.height + 30);
        tabs.selectedIndex = -1;

        var layout5 = new zim.Layout({
            holder:page5,
            regions:[
                {object:details, marginTop:30, height:60, maxWidth:90, align:"center", valign:"center"}
            ],
            scalingObject:stage,
            // regionShape:new zim.Shape()
        });
        layoutManager.add(layout5);


        ////////////////   PAGE 6  //////////////////

        var page6 = v.page6 = new zim.Container();

        var stats = new zim.Container(500,420).addTo(page6);

        var label3 = page6.message = new zim.Label({
            text:"CONGRATULATIONS!",
            color:"white",
            align:"center"
        }).center(stats).pos(null, 30);

        var margin = 6;
        var chart = new zim.Container(300, 200).center(stats);
        chart.addChild(new zim.Rectangle(chart.width,chart.height,"black").alp(.2));
        var wins = new zim.Label({
            text:"LOSSES",
            color:"white",
            align:"right",
            size:25,
            backing:new zim.Rectangle(chart.width*.55,(chart.height-margin*4)/3).alp(.8)
        }).addTo(chart).pos(margin, margin);
        wins.text = "WINS";

        var winsAmount = page6.winsAmount = new zim.Label({
            text:"2",
            color:"white",
            align:"center",
            size:25,
            backing:new zim.Rectangle(chart.width*.45-margin*3,wins.height,null,"#333",1)
        }).addTo(chart).pos(wins.width+margin*2, margin);

        var ties = wins.clone().addTo(chart).pos(null, wins.y + wins.height + margin);
        ties.text = "TIES";
        var tiesAmount = page6.tiesAmount = winsAmount.clone().addTo(chart).pos(null, wins.y + wins.height + margin);
        tiesAmount.text = "0";
        var losses = wins.clone().addTo(chart).pos(null, ties.y + ties.height + margin);
        losses.text = "LOSSES";
        var lossesAmount = page6.lossesAmount = winsAmount.clone().addTo(chart).pos(null, ties.y + ties.height + margin);
        lossesAmount.text = "3";

        var again = page6.again = new zim.Button({
            color:frame.pink,
            label:new zim.Label({
                text:"PLAY",
                color:"white"
            }),
            corner:0
        }).center(stats).pos(null, chart.y + chart.height +50);

        var clear = page6.clear = new zim.Button({
            width:90,
            height:40,
            label:new zim.Label({text:"CLEAR", size:20, color:"white", align:"center"}),
            color:"rgba(0,0,0,.3)",
            rollColor:"rgba(0,0,0,.6)",
            corner:0
        }).addTo(stats).pos(again.x-90-20, again.y+(again.height-40)/2);

        var rate = page6.rate = clear.clone()
            .addTo(stats).pos(again.x+again.width+20);
        rate.label.text = "RATE";

        var layout6 = new zim.Layout({
            holder:page6,
            regions:[
                {object:stats, marginTop:30, height:60, maxWidth:90, align:"center", valign:"center"}
            ],
            scalingObject:stage,
            // regionShape:new zim.Shape()
        });
        layoutManager.add(layout6);


        return v;
    }

    return app;
}(app || {});
