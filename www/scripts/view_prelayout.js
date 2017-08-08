
var app = function(app) {

    app.makeView = function() {
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

        v.blobSet2 = function() { // setting blob when going to page 2 or 3
            blob.color = "#333";
            v.positionBlob(points2)
            blob.points[2][0].rotation = -90;
            v.blobWiggle2();
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
            if (page == page1) {
                v.positionBlob(points, true);
                logo.scaleTo(stage).pos(0,stageH*.2);
                if (!wiggleSet) {
                    wiggleSet = true;
                    zim.timeout(wiggleBatchTime, v.blobWiggle);
                }
            } else if (page == page2 || page == page3) {
                v.positionBlob(points2, true);
                logo.scaleTo(stage).pos(0,stageH-logo.height);
                if (!wiggleSet) {
                    wiggleSet = true;
                    zim.timeout(wiggleBatchTime, v.blobWiggle2);
                }
            }
            // handle batch wiggle delayed update so resize does not keep triggering wiggle change
        }
        v.scale();



        ////////////////   PAGE 1  //////////////////

        var page1 = v.page1 = new zim.Container();

        var tagline = page1.tagline = new zim.Label({
            text:"THE MODERN TWISTER",
            color:"white",
            align:"center",
            fontOptions: "italic"
        }).centerReg(page1);

        var play = page1.play = new zim.Button({
            color:frame.pink,
            label:new zim.Label({
                text:"PLAY",
                // font:"Tw Cen MT",
                color:"white"
            }),
            corner:0
        }).centerReg(page1);

        page1.scale = function() { // called by resize event in main code
            play.scaleTo(stage, 60).pos(stageW/2, stageH*.7);
            tagline.scaleTo(stage, 60).scaleTo(stage,50).pos(stageW/2, stageH*.84);
            stage.update();
        }
        page1.scale();



        ////////////////   PAGE 2  //////////////////

        var page2 = v.page2 = new zim.Container();

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
        }).centerReg(page2);

        var next = page2.next = new zim.Button({
            label:"NEXT",
            color:frame.pink,
            corner:0
        }).centerReg(page2);

        var layout = new zim.Layout()

        page2.scale = function() { // called by resize event in main code
            label.scaleTo(stage,null,25).pos(stageW/2, stageH*.25);
            next.scaleTo(stage,null,12).pos(stageW/2, stageH*.55);
            stage.update();
        }
        page2.scale();


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
        }).centerReg(page3).scaleTo(stage,null,25).pos(stageW/2, stageH*.25);

        var go = page3.go = new zim.Button({
            label:"GO",
            color:frame.pink,
            corner:50,
            width:100,
            height:100
        }).centerReg(page3).expand();

        page3.scale = function() { // called by resize event in main code
            label.scaleTo(stage,null,25).pos(stageW/2, stageH*.25);
            next.scaleTo(stage,null,12).pos(stageW/2, stageH*.55);
            stage.update();
        }
        page3.scale();

        ////////////////   PAGE 4  //////////////////

        var page4 = v.page4 = new zim.Container();

        var outer = page4.outer = new zim.Circle(stageW*.95/2, frame.green, "rgba(0,0,0,.2)", 1, false)
            .addTo(page4).pos(stageW/2, stageH/2).expand(600);
        var inner = page4.inner = new zim.Circle(stageW*.5/2, frame.yellow, "rgba(0,0,0,.2)", 1, false)
            .addTo(page4).pos(stageW/2, stageH/2);

        var time = page4.time = new zim.Label({
            text:"0:20",
            color:"white"
        }).centerReg(page4);
        time.fit(
            stageW*.3,
            (stageH + outer.height)/2 + stageH*.02,
            stageW*.4,
            (stageH - outer.height)/2 - stageH*.02 * 2
        );

        var protect = page4.protect = new zim.Label({
            text:"PROTECT YOUR TARGET\nFOR A HIGHER SCORE",
            color:"white"
        }).centerReg(page4)
        protect.fit(
            stageW*.03,
            stageH*.02,
            stageW*.6,
            (stageH - outer.height)/2 - stageH*.02 * 2
        );

        var score = page4.score = new zim.Label({
            text:"100",
            color:"white",
            backing:new zim.Rectangle(100, 50, "rgba(0,0,0,.2)")
        }).centerReg(page4);
        score.fit(
            stageW*(1-.03)-stageW*.3,
            stageH*.02,
            stageW*.3,
            (stageH - outer.height)/2 - stageH*.02 * 2
        );

        // new zim.Grid();

        ////////////////   PAGE 5  //////////////////

        var page5 = v.page5 = new zim.Container();

        var rect = new zim.Rectangle(100,100).addTo(page5);

        return v;
    }

    return app;
}(app || {});
