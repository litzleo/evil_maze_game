var gioco_tanga = (function(undefined) {
    var public = {};//sempre avere questa variabile all'inizio

    var plan_dim = {h : 3, w : 16, l : 9};
    var EXPLOSION_TIME = 1460;

    var plan;
    var img = {};
    img.mirror = [];
    var height=0;
    var pg = {x : 0, y : 0, dir : 'S', toDie : false, timeOfDeath : undefined};
    var state = "game";
    var st_angle = 0;
    var fi_angle = 0;
    var rot_time = 100;
    var active_color = [];
    var t0=0;
    var activePlate = {x : -1, y : -1};
    var exit;
    var change = true;
    var st_time;
    var text_time = 1200;
    var displayHeight = false;
    var displaySaved = false;
    var displayLoaded = false;
    var layoutChanged = false;
    var sound = {};
    var azerty = false;

    var savedPlan = {}, savedPg = {}, saved = false;




    function createArray(length) {
        var arr = new Array(length || 0),
                i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--)
                arr[length - 1 - i] = createArray.apply(this, args);
        }

        return arr;
    }

    function compareColors(c1, c2){
        var col1 = c1.slice();
        var col2 = c2.slice();

        if(col1.length === 1){
            col1.push(col1[0]);
            col1.push(col1[0]);
        }

        if(col2.length === 1){
            col2.push(col2[0]);
            col2.push(col2[0]);
        }

        if(col1.length === 3 && col2.length === 3){
            for(var i=0;i<3;i++){
                if(col1[i] !== col2[i])return false;
            }
            return true;
        }
        else return false;
    }


    public.constructor = function(){

        var createWalls = function(a, b, c, walls){
            plan[a][b][c].walls = walls;
        };

        var createMirror = function(a, b, c, mirrors, color){
            plan[a][b][c].type = "mirror";
            plan[a][b][c].mirrors = mirrors;
            plan[a][b][c].color = color;
        };

        var createPlate = function(a, b, c, color){
            plan[a][b][c].type = "plate";
            plan[a][b][c].color = color;
        };

        var createLever = function(a, b, c, toggled, color){
            plan[a][b][c].type = "lever";
            plan[a][b][c].toggled = toggled;
            plan[a][b][c].color = color;
        };

        var createLadder = function(a, b, c, des){
            plan[a][b][c].type = "ladder";
            plan[a][b][c].destination = des;
        };

        height=0;
        pg = {x : 0, y : 8, dir : 'S', toDie : false, timeOfDeath : undefined};
        state = "game";
        st_angle = 0;
        fi_angle = 0;
        rot_time = 150;
        active_color = [];
        t0=0;
        activePlate = {x : -1, y : -1};
        exit = {h : 0, x : 0, y : 0, e : 'W'};
        change = true;

        plan = createArray(plan_dim.h, plan_dim.w, plan_dim.l);
        for(var i=0;i<plan_dim.h;i++){
            for(var j=0;j<plan_dim.w;j++){
                for(var k=0;k<plan_dim.l;k++){
                    plan[i][j][k] = {};
                    plan[i][j][k].walls = "";
                    plan[i][j][k].type = "pav";
                }
            }
        }


        createWalls(0, 0, 8, "W");
        createWalls(0, 1, 7, "WS");
        createWalls(0, 2, 8, "D");
        createWalls(0, 2, 7, "D");
        createWalls(0, 0, 5, "WS");
        createWalls(0, 1, 5, "W");
        createPlate(0, 1, 8, [50,220,250]);
        createMirror(0, 2, 6, "AS", [50,220,250]);
        createMirror(0, 3, 5, "AD", [200,170,20]);
        createLadder(0, 0, 5, 1);



        createWalls(1, 0, 5, "WS");
        createWalls(1, 1, 5, "D");
        createWalls(1, 0, 6, "S");
        createWalls(1, 1, 6, "SD");
        createPlate(1, 1, 6, [200,170,20]);
        createMirror(1, 1, 4, "DS", [200,170,20]);



        createWalls(0, 0, 3, "WS");
        createWalls(0, 1, 3, "WS");
        createWalls(0, 2, 3, "DW");
        createWalls(0, 2, 4, "A");
        createWalls(0, 4, 3, "W");
        createWalls(0, 3, 2, "DW");
        createMirror(0, 0, 2, "WD", [50,150,20]);
        createMirror(0, 0, 3, "D", [50,150,20]);
        createMirror(0, 5, 3, "SD", [50,150,20]);
        createMirror(0, 4, 4, "DA", [50,220,250]);
        createPlate(0, 1, 3, [50,220,250]);
        createLever(0, 2, 4, false, [50,150,20]);
        createLadder(0, 4, 3, 1);



        createWalls(1, 1, 2, "AW");
        createWalls(1, 1, 3, "A");
        createWalls(1, 2, 3, "WDA");
        createWalls(1, 3, 4, "S");
        createWalls(1, 2, 2, "W");
        createWalls(1, 3, 2, "W");
        createWalls(1, 4, 3, "D");
        createWalls(1, 4, 4, "AW");
        createWalls(1, 4, 2, "WD");
        createMirror(1, 4, 2, "AWD", [50,150,20]);
        createMirror(1, 2, 3, "WASD", [50,150,20]);
        createPlate(1, 1, 3, [50,150,20]);
        createLever(1, 3, 3, true, [200,170,20]);



        createMirror(0, 1, 0, "WDS", [255]);
        createWalls(0, 1, 0, "D");
        createWalls(0, 1, 1, "D");

        createWalls(0, 6, 8, "D");

        createLadder(1, 5, 2, 0);


        createWalls(0, 7, 2, "D");
        createWalls(0, 7, 1, "AW");
        createWalls(0, 8, 1, "W");
        createWalls(0, 9, 1, "W");
        createWalls(0, 10, 1, "W");
        createWalls(0, 10, 2, "D");
        createMirror(0, 10, 2, "AWS", [100]);
        createMirror(0, 9, 1, "WDS", [0]);
        createLadder(0, 9, 2, 2);

        createWalls(1, 7, 2, "AW");
        createWalls(1, 8, 2, "WS");
        createWalls(1, 6, 3, "DS");
        createWalls(1, 8, 3, "WD");
        createWalls(1, 9, 3, "SD");
        createWalls(1, 6, 5, "AS");
        createWalls(1, 8, 5, "AW");
        createWalls(1, 9, 5, "D");
        createWalls(1, 6, 6, "D");
        createWalls(1, 8, 6, "S");
        createWalls(1, 9, 6, "SD");
        createWalls(1, 9, 1, "SD");
        createMirror(1, 4, 4, "AD", [200,170,20]);
        createMirror(1, 10, 4, "AW", [200,170,20]);
        createMirror(1, 7, 7, "W", [255,20,100]);
        createMirror(1, 10, 2, "AS", [50,150,20]);
        createMirror(1, 5, 1, "AWD", [50,150,20]);
        createMirror(1, 5, 6, "ASD", [50,150,20]);
        createPlate(1, 8, 2, [50,150,20]);
        createLever(1, 9, 6, false, [255,255,80]);
        createLever(1, 9, 3, false, [255]);

        createWalls(2, 6, 3, "AW");
        createWalls(2, 6, 5, "WD");
        createWalls(2, 8, 5, "SD");
        createWalls(2, 8, 3, "AS");
        createWalls(2, 9, 3, "S");
        createWalls(2, 5, 4, "WS");
        createWalls(2, 4, 4, "SAW");
        createWalls(2, 9, 5, "D");
        createWalls(2, 6, 6, "D");
        createWalls(2, 8, 7, "D");
        createMirror(2, 4, 4, "D", [255,255,80]);
        createMirror(2, 10, 4, "S", [255,20,100]);
        createMirror(2, 7, 7, "S", [200,170,20]);
        createMirror(2, 8, 8, "W", [50,150,20]);
        createMirror(2, 9, 6, "AW", [100]);
        createLever(2, 5, 4, false, [200,170,20]);
        createLever(2, 7, 2, false, [255,20,100]);
        createLever(2, 9, 5, false, [50,150,20]);
        createLever(2, 8, 7, false, [50,150,20]);
        createLadder(2, 7, 4, 1);

        createLadder(0, 9, 2, 2);
        createWalls(2, 10, 2, "WDS");
        createWalls(2, 9, 2, "WS");
        createWalls(2, 8, 2, "WS");
        createWalls(2, 7, 2, "AW");
        createMirror(2, 10, 2, "WDS", [0]);
        createPlate(2, 8, 2, [0]);


        createWalls(0, 8, 3, "W");
        createWalls(0, 9, 3, "WS");
        createWalls(0, 10, 3, "WS");
        createWalls(0, 11, 3, "WS");
        createWalls(0, 12, 3, "W");
        createWalls(0, 9, 5, "WS");
        createWalls(0, 10, 5, "WS");
        createWalls(0, 11, 5, "WS");
        createWalls(0, 9, 7, "WS");
        createWalls(0, 10, 7, "WS");
        createWalls(0, 11, 7, "WS");
        createWalls(0, 7, 7, "WD");
        createWalls(0, 13, 4, "A");
        createWalls(0, 13, 5, "A");
        createWalls(0, 13, 6, "A");
        createWalls(0, 13, 7, "A");
        createWalls(0, 14, 3, "S");
        createWalls(0, 14, 5, "WS");
        createWalls(0, 14, 7, "WS");
        createWalls(0, 7, 3, "AW");
        createWalls(0, 7, 4, "A");
        createWalls(0, 7, 5, "A");
        createWalls(0, 7, 6, "AS");
        createWalls(0, 12, 7, "S");
        createWalls(0, 10, 8, "A");

        createMirror(0, 7, 3, "WASD", [255,20,100]);
        createMirror(0, 7, 4, "WASD", [255,20,100]);
        createMirror(0, 7, 5, "WASD", [255,20,100]);
        createMirror(0, 7, 6, "WASD", [255,20,100]);

        createMirror(0, 15, 4, "WDS", [40,255,170]);
        createMirror(0, 15, 5, "AWD", [255,0,255]);
        createMirror(0, 15, 6, "AWS", [0,0,255]);
        createMirror(0, 15, 7, "AWD", [100]);

        createMirror(0, 14, 8, "AWD", [50,220,250]);
        createMirror(0, 10, 8, "AWD", [90,0,0]);
        createMirror(0, 9, 8, "A", [255,255,80]);
        createMirror(0, 13, 1, "ASD", [50,150,20]);
        createMirror(0, 14, 3, "AWD", [90,0,0]);
        createLever(0, 11, 8, false, [255]);
        createLever(0, 14, 4, false, [50,220,250]);
        createLever(0, 14, 5, false, [50,220,250]);
        createLever(0, 14, 6, false, [90, 0, 0]);
        createLever(0, 14, 7, false, [90,0,0]);

        createPlate(0, 9, 3, [255,0,255]);
        createPlate(0, 9, 4, [0,0,255]);
        createPlate(0, 9, 5, [100]);
        createPlate(0, 9, 6, [40,255,170]);

        createPlate(0, 10, 3, [40,255,170]);
        createPlate(0, 10, 4, [255,0,255]);
        createPlate(0, 10, 5, [0,0,255]);
        createPlate(0, 10, 6, [100]);

        createPlate(0, 11, 3, [100]);
        createPlate(0, 11, 4, [40,255,170]);
        createPlate(0, 11, 5, [255,0,255]);
        createPlate(0, 11, 6, [0,0,255]);

        createPlate(0, 12, 8, [50,150,20]);


        createWalls(0, 14, 1, "AS");
        createWalls(0, 14, 2, "S");
        createWalls(0, 12, 2, "AW");
        createWalls(0, 13, 1, "W");
        createWalls(0, 12, 0, "A");
        createMirror(0, 12, 2, "WASD", [90,0,0]);
        createMirror(0, 15, 3, "WASD", [50,220,250]);
        createMirror(0, 15, 0, "WDS", [50,220,250]);
        createMirror(0, 10, 1, "ASD", [90,0,0]);
        createPlate(0, 14, 2, [50,150,20]);
        createPlate(0, 15, 2, [50,150,20]);


        createWalls(0, 5, 3, "WDS");
        createWalls(0, 4, 4, "DS");
        createWalls(0, 3, 5, "DS");
        createWalls(0, 2, 6, "D");
        createWalls(0, 4, 6, "WS");
        createWalls(0, 5, 7, "AD");
        createMirror(0, 5, 6, "AWS", [0,90,0]);
        createLever(0, 4, 6, false, [90,0,0]);
        createLever(0, 5, 7, true, [243,99,65]);
        createLadder(0, 4, 7, 2);

        createWalls(2, 0, 1, "D");
        createWalls(2, 0, 2, "D");
        createWalls(2, 0, 3, "D");
        createWalls(2, 0, 4, "S");
        createWalls(2, 2, 2, "WS");
        createWalls(2, 4, 2, "WS");
        createWalls(2, 3, 3, "AD");
        createWalls(2, 3, 4, "A");
        createWalls(2, 2, 5, "AD");
        createWalls(2, 1, 6, "WS");
        createWalls(2, 3, 6, "WS");
        createWalls(2, 2, 7, "AD");
        createWalls(2, 0, 8, "W");
        createMirror(2, 0, 8, "ASD", [0,0,255]);
        createMirror(2, 3, 2, "AWS", [90,0,0]);
        createMirror(2, 0, 2, "AWS", [255,20,100]);
        createMirror(2, 2, 6, "AWS", [243,99,65]);
        createLever(2, 0, 1, false, [255]);
        createLever(2, 0, 3, false, [243,99,65]);
        createLever(2, 2, 2, false, [255,20,100]);
        createLever(2, 3, 3, true, [243,99,65]);
        createLever(2, 4, 2, false, [243,99,65]);
        createLever(2, 2, 5, false, [0,90,0]);
        createLever(2, 1, 6, false, [255,20,100]);
        createLever(2, 3, 6, false, [90,0,0]);
        createLever(2, 2, 7, false, [0,90,0]);


        createWalls(1, 0, 0, "S");
        createWalls(1, 1, 1, "D");
        createWalls(1, 2, 0, "D");
        createWalls(1, 5, 1, "AW");
        createWalls(1, 5, 6, "ASD");
        createMirror(1, 0, 0, "AWD", [255]);

        createLadder(0, 0, 4, 1);
        createLever(0, 1, 4, false, [200,170,20]);


        createWalls(2, 11, 3, "AWD");
        createWalls(2, 12, 3, "AWD");
        createWalls(2, 13, 3, "AWD");
        createWalls(2, 14, 3, "A");
        createWalls(2, 15, 3, "W");
        createWalls(2, 11, 6, "AS");
        createWalls(2, 12, 6, "S");
        createWalls(2, 13, 6, "SD");
        createWalls(2, 14, 6, "AS");
        createWalls(2, 15, 6, "S");
        createWalls(2, 11, 4, "AD");
        createWalls(2, 11, 5, "AD");
        createWalls(2, 15, 4, "A");
        createWalls(2, 15, 5, "AS");
        createWalls(2, 13, 4, "AS");
        createWalls(2, 12, 5, "AS");
        createWalls(2, 12, 4, "A");
        createWalls(2, 3, 0, "A");
        createWalls(2, 4, 1, "W");
        createWalls(2, 5, 1, "W");
        createWalls(2, 6, 1, "WD");
        createMirror(2, 8, 0, "AWD", [50,150,20]);

        createWalls(1, 15, 1, "AW");
        createWalls(1, 15, 2, "A");
        createWalls(1, 11, 3, "AW");
        createWalls(1, 13, 3, "WD");
        createWalls(1, 14, 3, "ADW");
        createWalls(1, 11, 6, "AW");
        createWalls(1, 12, 6, "SD");
        createWalls(1, 13, 6, "AS");
        createWalls(1, 14, 6, "S");
        createWalls(1, 15, 6, "WS");
        createWalls(1, 14, 4, "AS");
        createWalls(1, 12, 4, "AWD");
        createWalls(1, 11, 4, "A");
        createWalls(1, 11, 5, "A");
        createWalls(1, 8, 0, "SA");
        createPlate(1, 15, 2, [90,0,0]);
        createMirror(1, 8, 0, "WDS", [90,0,0]);
        createMirror(1, 9, 8, "AWD", [50,150,20]);
        createMirror(1, 15, 0, "AWD", [50,150,20]);

        createLever(1, 12, 1, true, [200,170,20]);

        for(var i=11; i<=15; i++){
            for(var j=3; j<=6; j++){
                createLadder(1,i,j,2);
            }
        }

        for(var i=0;i<plan_dim.h;i++){
            for(var j=0;j<plan_dim.w;j++){
                for(var k=0;k<plan_dim.l;k++){
                    if((k===0 || plan[i][j][k-1].walls.indexOf("S")!==-1) &&
                            plan[i][j][k].walls.indexOf("W")===-1){
                        plan[i][j][k].walls += "W";
                    }
                    if((k===plan_dim.l-1 || plan[i][j][k+1].walls.indexOf("W")!==-1) &&
                            plan[i][j][k].walls.indexOf("S")===-1){
                        plan[i][j][k].walls += "S";
                    }
                    if((j===0 || plan[i][j-1][k].walls.indexOf("D")!==-1) &&
                            plan[i][j][k].walls.indexOf("A")===-1){
                        plan[i][j][k].walls += "A";
                    }
                    if((j===plan_dim.w-1 || plan[i][j+1][k].walls.indexOf("A")!==-1) &&
                            plan[i][j][k].walls.indexOf("D")===-1){
                        plan[i][j][k].walls += "D";
                    }
                    if(plan[i][j][k].type === "ladder"){
                        plan[plan[i][j][k].destination][j][k].type = "ladder";
                        plan[plan[i][j][k].destination][j][k].destination = i;
                    }
                }
            }
        }

        plan[exit.h][exit.x][exit.y].type = "exit";
        plan[exit.h][exit.x][exit.y].exit = exit.e;

    };


    function copyPlan(sourcePlan){

      var destPlan = createArray(plan_dim.h, plan_dim.w, plan_dim.l);

      for(var i=0;i<plan_dim.h;i++){
        for(var j=0;j<plan_dim.w;j++){
          for(var k=0;k<plan_dim.l;k++){
            var tile = sourcePlan[i][j][k];
            destPlan[i][j][k] = {};
            destPlan[i][j][k].type = tile.type;
            destPlan[i][j][k].walls = tile.walls;

            switch(tile.type){
              case "mirror":
                destPlan[i][j][k].mirrors = tile.mirrors;
                destPlan[i][j][k].color = tile.color;
              break;
              case "plate":
                destPlan[i][j][k].color = tile.color;
              break;
              case "lever":
                destPlan[i][j][k].toggled = tile.toggled;
                destPlan[i][j][k].color = tile.color;
              break;
              case "ladder":
                destPlan[i][j][k].destination = tile.destination;
              break;
              case "exit":
                destPlan[i][j][k].exit = tile.exit;
              break;
            }
          }
        }
      }

      return destPlan;
      

    }
    
    function copyPG(sourcePG){
        var destPG = {x:sourcePG.x, y:sourcePG.y, dir:sourcePG.dir, toDie:sourcePG.toDie, timeOfDeath:sourcePG.timeOfDeath};
        return destPG;
    }

    function finalizeRotateMir(){
        for(var i=0;i<plan_dim.h;i++){
            for(var j=0;j<plan_dim.w;j++){
                for(var k=0;k<plan_dim.l;k++){
                    var tile = plan[i][j][k];
                    if(tile.type === "mirror" && compareColors(tile.color, active_color)){
                        var replace = "";
                        for(var l=0;l<tile.mirrors.length;l++){
                            switch(tile.mirrors.charAt(l)){
                                case 'W':
                                    if(fi_angle > 0){
                                        replace += "D";
                                    }
                                    else{
                                        replace += "A";
                                    }
                                break;
                                case 'A':
                                    if(fi_angle > 0){
                                        replace += "W";
                                    }
                                    else{
                                        replace += "S";
                                    }
                                break;
                                case 'S':
                                    if(fi_angle > 0){
                                        replace += "A";
                                    }
                                    else{
                                        replace += "D";
                                    }
                                break;
                                case 'D':
                                    if(fi_angle > 0){
                                        replace += "S";
                                    }
                                    else{
                                        replace += "W";
                                    }
                                break;
                            }
                        }
                        tile.mirrors = replace;
                    }
                }
            }
        }
    };


    public.draw = function(to_redraw) {//tutti i metodi pubblici (accessibili da fuori) iniziano con public.
        if(to_redraw || change || state !== "game" || displayHeight || displaySaved || displayLoaded || layoutChanged || pg.toDie){
            push();
            if(pg.timeOfDeath !== undefined){
                var amp = map(new Date().getTime(), pg.timeOfDeath,  pg.timeOfDeath + EXPLOSION_TIME,
                    12, 4);
                translate(random()*amp - amp/2, random()*amp - amp/2);
            }
            change = false;
            background(0);
            fill(255);
            stroke(0);
            strokeWeight(1);

            if(state === "ani_mirror"){
                if(Math.abs(st_angle) < Math.abs(fi_angle)){
                    st_angle = map(new Date().getTime(), t0, t0+rot_time, 0, fi_angle);
                }
                else{
                    state = "game";
                    st_angle = 0;
                    for(var i=0;i<Math.abs(fi_angle);i+=PI/2)
                        finalizeRotateMir();
                    checkDieCondition();
                }
            }
            noStroke();

            for(var i=0;i<plan_dim.w;i++){
                for(var j=0;j<plan_dim.l;j++){

                    image(img.pav, i*100, j*100, 100, 100);
                    switch(plan[height][i][j].type){
                        case "mirror":
                            if(state === "ani_mirror" &&
                                    compareColors(plan[height][i][j].color, active_color)){

                                drawTile(img.mirror, plan[height][i][j].mirrors,
                                    i*100, j*100, 100, 100, st_angle);
                            }
                            else drawTile(img.mirror, plan[height][i][j].mirrors,
                                    i*100, j*100, 100, 100, 0);
                            fill(plan[height][i][j].color);
                            ellipse(i*100 + 50, j*100 + 50, 20, 20);
                        break;
                        case "plate":
                            fill(plan[height][i][j].color);

                            if(i === activePlate.x && j === activePlate.y){
                                rect(i*100 + 20, j*100 + 25, 60, 55);
                                image(img.plate_down, i*100 + 20, j*100 + 20, 60, 60);
                            }
                            else{
                                rect(i*100 + 20, j*100 + 20, 60, 60);
                                image(img.plate, i*100 + 20, j*100 + 20, 60, 60);
                            }
                        break;
                        case "lever":
                            fill(plan[height][i][j].color);
                            rect(i*100 + 25, j*100 + 41 -20, 50, 34);
                            if(plan[height][i][j].toggled === true){
                                push();
                                scale(-1, 1);
                                image(img.lever, -(i*100 + 75), j*100 + 25 -20, 50, 50);
                                pop();
                            }
                            else{
                                image(img.lever, i*100 + 25, j*100 + 25 -20, 50, 50);
                            }
                        break;
                        case "ladder":
                            if(plan[height][i][j].destination > height){
                                image(img.ladder_up, i*100 + 15, j*100 + 15, 70, 70);
                            }
                            else{
                                fill(240);
                                rect(i*100 + 29, j*100 + 29, 42, 42);
                                image(img.ladder_down, i*100 + 15, j*100 + 15, 70, 70);

                                for(var h=j*100 + 29; h<j*100+71;h++){
                                    fill(0, map(h-h%6, j*100 + 29, j*100 + 70, 0, 245));
                                    rect(i*100 + 29, h, 42, 1);
                                }
                            }
                        break;
                    }
                }
            }

            for(var i=0;i<plan_dim.w;i++){
                for(var j=0;j<plan_dim.l;j++){

                    for(var k=0;k<plan[height][i][j].walls.length;k++){
                        switch(plan[height][i][j].walls.charAt(k)){
                            case 'W':
                                image(img.wall, i*100 - 10, j*100 - 10, 120, 20);
                            break;
                            case 'A':
                                push();
                                translate(i*100, j*100 + 50);
                                rotate(PI/2);
                                image(img.wall, -60, -10, 120, 20);
                                pop();
                            break;
                            case 'S':
                                image(img.wall, i*100 - 10, j*100 + 90, 120, 20);
                            break;
                            case 'D':
                                push();
                                translate(i*100 + 100, j*100 + 50);
                                rotate(PI/2);
                                image(img.wall, -60, -10, 120, 20);
                                pop();
                            break;
                        }
                    }
                }
            }

            for(var i=0;i<plan_dim.w;i++){
                for(var j=0;j<plan_dim.l;j++){
                    walls = [false, false, false, false];
                    for(var k=0;k<plan[height][i][j].walls.length;k++){
                        switch(plan[height][i][j].walls.charAt(k)){
                            case 'W':
                                walls[0]=true;
                            break;
                            case 'A':
                                walls[1]=true;
                            break;
                            case 'S':
                                walls[2]=true;
                            break;
                            case 'D':
                                walls[3]=true;
                            break;
                        }
                    }

                    if(walls[0] && walls[1]){
                        image(img.junction, i*100 - 10, j*100 - 10, 20, 20);
                    }
                    if(walls[1] && walls[2]){
                        image(img.junction, i*100 - 10, j*100 + 90, 20, 20);
                    }
                    if(walls[2] && walls[3]){
                        image(img.junction, i*100 + 90, j*100 + 90, 20, 20);
                    }
                    if(walls[3] && walls[0]){
                        image(img.junction, i*100 + 90, j*100 - 10, 20, 20);
                    }
                }
            }

            /*fill(0,100,200);
            ellipse(pg.x*100+50,pg.y*100+50,40,40);*/
            if(pg.timeOfDeath === undefined ||  new Date().getTime()< pg.timeOfDeath + EXPLOSION_TIME*2/9){
                switch(pg.dir){
                    case 'W':
                        image(img.pg_back_idle, pg.x*100 + 10, pg.y*100, 80, 80);
                    break;
                    case 'A':
                        image(img.pg_left_idle, pg.x*100 + 10, pg.y*100, 80, 80);
                    break;
                    case 'S':
                        image(img.pg_front_idle, pg.x*100 + 10, pg.y*100, 80, 80);
                    break;
                    case 'D':
                        image(img.pg_right_idle, pg.x*100 + 10, pg.y*100, 80, 80);
                    break;
                }
            }

            if(height === exit.h){
                push();
                translate(exit.x*100 + 50, exit.y*100 + 50);
                if(exit.e === 'D'){
                    rotate(PI/2);
                }
                if(exit.e === 'S'){
                    rotate(PI);
                }
                if(exit.e === 'A'){
                    rotate(-PI/2);
                }
                image(img.exit, -50, -50, 100, 100);
                pop();
            }

            if(pg.toDie && state === "game"){
                finish(false);
            }
            if(displayHeight){
                if(new Date().getTime() < st_time + text_time){
                    textSize(60);
                    textAlign(CENTER);
                    if(new Date().getTime() < st_time+text_time/3){
                        fill(20,240,255, map(new Date().getTime(), st_time,st_time+text_time/3, 0, 255));
                    }
                    else{
                        fill(20,240,255, map(new Date().getTime(), st_time+text_time/3,st_time+text_time, 255, 0));
                    }
                    if(height !== 0)text(height+String.fromCharCode(0x00B0)+" floor", 800, 800);
                    else text("Ground floor", 800, 800);
                }
                else displayHeight = false;
            }
            if(displaySaved){
                if(new Date().getTime() < st_time + text_time){
                    textSize(60);
                    textAlign(CENTER);
                    if(new Date().getTime() < st_time+text_time/3){
                        fill(20,240,255, map(new Date().getTime(), st_time,st_time+text_time/3, 0, 255));
                    }
                    else{
                        fill(20,240,255, map(new Date().getTime(), st_time+text_time/3,st_time+text_time, 255, 0));
                    }
                    text("Savefile saved", 800, 800);
                }
                else displaySaved = false;
            }
            if(displayLoaded){
                if(new Date().getTime() < st_time + text_time){
                    textSize(60);
                    textAlign(CENTER);
                    if(new Date().getTime() < st_time+text_time/3){
                        fill(20,240,255, map(new Date().getTime(), st_time,st_time+text_time/3, 0, 255));
                    }
                    else{
                        fill(20,240,255, map(new Date().getTime(), st_time+text_time/3,st_time+text_time, 255, 0));
                    }
                    text("Savefile loaded", 800, 800);
                }
                else displayLoaded = false;
            }
            if(layoutChanged){
                if(new Date().getTime() < st_time + text_time){
                    textSize(60);
                    textAlign(CENTER);
                    if(new Date().getTime() < st_time+text_time/3){
                        fill(20,240,255, map(new Date().getTime(), st_time,st_time+text_time/3, 0, 255));
                    }
                    else{
                        fill(20,240,255, map(new Date().getTime(), st_time+text_time/3,st_time+text_time, 255, 0));
                    }
                    if(azerty)text("You have selected Azerty", 800, 800);
                    else text("You have selected Qwerty", 800, 800);
                }
                else displayLoaded = false;
            }
            if(pg.timeOfDeath !== undefined){
                var timeExplosion = new Date().getTime() - pg.timeOfDeath;
                var expSlot = floor(map(timeExplosion, 0, EXPLOSION_TIME, 0, 80));
                var expX = expSlot%9;
                var expY = floor(expSlot/9);
                var slotDim = img.explosion.width/9;
                image(img.explosion, pg.x*100, pg.y*100, 100, 100,
                expX*slotDim, expY*slotDim, slotDim, slotDim);
            }

            pop();
        }
    };

    function drawTile(tile, orientation, x, y, w, h, alpha){
        push();
        translate(x+w/2, y+h/2);
        rotate(alpha);
        var str = orientation;
        switch(str.length){
            case 0:
                if(tile[0] !== undefined)image(tile[0], -w/2, -h/2, w, h);
            break;
            case 4:
                image(tile[5], -w/2, -h/2, w, h);
            break;
            case 1:
                switch(str.charAt(0)){
                    case 'S':
                        image(tile[1], -w/2, -h/2, w, h);
                    break;
                    case 'A':
                        rotate(PI/2);
                        image(tile[1], -w/2, -h/2, w, h);
                    break;
                    case 'W':
                        rotate(PI);
                        image(tile[1], -w/2, -h/2, w, h);
                    break;
                    case 'D':
                        rotate(-PI/2);
                        image(tile[1], -w/2, -h/2, w, h);
                    break;
                }
            break;
            case 2:
                if((str.indexOf("A") === -1 && str.indexOf("D") === -1) ||
                        (str.indexOf("W") === -1 && str.indexOf("S") === -1)){
                    if(str.indexOf("A")!==-1)
                        rotate(PI/2);

                    image(tile[3], -w/2, -h/2, w, h);
                }
                else{
                    if(str.indexOf("S")!==-1){
                        if(str.indexOf("A")!==-1){
                            rotate(PI/2);
                            image(tile[2], -w/2, -h/2, w, h);
                        }
                        else{
                            image(tile[2], -w/2, -h/2, w, h);
                        }
                    }
                    else{
                        if(str.indexOf("A")!==-1){
                            rotate(PI);
                            image(tile[2], -w/2, -h/2, w, h);
                        }
                        else{
                            rotate(-PI/2);
                            image(tile[2], -w/2, -h/2, w, h);
                        }
                    }
                }
            break;
            case 3:
                if(str.indexOf("A")===-1){
                    image(tile[4], -w/2, -h/2, w, h);
                }
                else if(str.indexOf("W")===-1){
                    rotate(PI/2);
                    image(tile[4], -w/2, -h/2, w, h);
                }
                else if(str.indexOf("D")===-1){
                    rotate(PI);
                    image(tile[4], -w/2, -h/2, w, h);
                }
                else if(str.indexOf("S")===-1){
                    rotate(-PI/2);
                    image(tile[4], -w/2, -h/2, w, h);
                }
            break;
        }
        pop();
    };

    function rotateMir(angle, color){
        state = "ani_mirror";
        fi_angle = angle;
        active_color = color;
        t0 = new Date().getTime();
    };

    function checkDieCondition(){
        switch(pg.dir){
            case 'W':
                for(var i=pg.y-1;i>=0;i--){
                    if(plan[height][pg.x][i].walls.indexOf("S") !== -1)break;
                    if(plan[height][pg.x][i].type === "mirror"){
                        if(plan[height][pg.x][i].mirrors.indexOf("S") !== -1)pg.toDie = true;
                        else break;
                    }
                }
            break;
            case 'A':
                for(var i=pg.x-1;i>=0;i--){
                    if(plan[height][i][pg.y].walls.indexOf("D") !== -1)break;
                    if(plan[height][i][pg.y].type === "mirror"){
                        if(plan[height][i][pg.y].mirrors.indexOf("D") !== -1)pg.toDie = true;
                        else break;
                    }
                }
            break;
            case 'S':
                for(var i=pg.y+1;i<plan_dim.l;i++){
                    if(plan[height][pg.x][i].walls.indexOf("W") !== -1)break;
                    if(plan[height][pg.x][i].type === "mirror"){
                        if(plan[height][pg.x][i].mirrors.indexOf("W") !== -1)pg.toDie = true;
                        else break;
                    }
                }
            break;
            case 'D':
                for(var i=pg.x+1;i<plan_dim.w;i++){
                    if(plan[height][i][pg.y].walls.indexOf("A") !== -1)break;
                    if(plan[height][i][pg.y].type === "mirror"){
                        if(plan[height][i][pg.y].mirrors.indexOf("A") !== -1)pg.toDie = true;
                        else break;
                    }
                }
            break;
        }
    };

    function finish(victoryState){
        sound.theme.stop();
        pg.timeOfDeath = new Date().getTime();
        if(!victoryState){
            state = "death";
            sound.explosion.play();
        }
        setTimeout(function(){
            gameCompleted(victoryState);
        }, victoryState ? 200 : EXPLOSION_TIME);
    };

    public.keyPressed = function() {
        if(!sound.theme.isPlaying())sound.theme.loop();
        switch(state){
            case "game":
                var pgHasMoved = false;
                if(plan[height][pg.x][pg.y].type === "exit"){
                    if(key === exit.e)finish(true);
                }
                if((key === "W" || key === "A" || key === "S" || key === "D") && pg.dir !== key){
                    pg.dir = key;
                    change = true;
                    checkDieCondition();
                }
                var vKey = key;
                if(azerty){
                    case "W":
                        vKey = "Z";
                    break;
                    case "A":
                        vKey = "Q";
                    break;
                }
                switch(key){
                    case "F":
                        azerty = !azerty;
                        layoutChanged = true;
                        st_time = new Date().getTime();
                    break;
                    case "W":
                        if(plan[height][pg.x][pg.y].walls.indexOf("W")===-1 &&
                                plan[height][pg.x][pg.y-1].type !== "mirror"){
                                pg.y--;
                                pgHasMoved = true;
                            }
                    break;
                    case "A":
                        if(plan[height][pg.x][pg.y].walls.indexOf("A")===-1 &&
                                plan[height][pg.x-1][pg.y].type !== "mirror"){
                                pg.x--;
                                pgHasMoved = true;
                            }
                    break;
                    case "S":
                        if(plan[height][pg.x][pg.y].walls.indexOf("S")===-1 &&
                                plan[height][pg.x][pg.y+1].type !== "mirror"){
                                pg.y++;
                                pgHasMoved = true;
                            }
                    break;
                    case "D":
                        if(plan[height][pg.x][pg.y].walls.indexOf("D")===-1 &&
                                plan[height][pg.x+1][pg.y].type !== "mirror"){
                                pg.x++;
                                pgHasMoved = true;
                            }
                    break;
                    case "E":
                        if(plan[height][pg.x][pg.y].type === "lever"){
                            plan[height][pg.x][pg.y].toggled = !plan[height][pg.x][pg.y].toggled;
                            if(plan[height][pg.x][pg.y].toggled){
                                rotateMir(PI/2, plan[height][pg.x][pg.y].color);
                            }
                            else rotateMir(-PI/2, plan[height][pg.x][pg.y].color);
                        }
                    break;
                    case "L":
                        change = true;
                        if(saved){
                          plan=copyPlan(savedPlan);
                          pg=copyPG(savedPg);
                          displayLoaded = true;
                          st_time = new Date().getTime();
                        } else {
                          savedPlan=copyPlan(plan);
                          savedPg=copyPG(pg);
                          displaySaved = true;
                          st_time = new Date().getTime();
                        }
                        saved = !saved;
                    break;
                }
                if(pgHasMoved){
                    change = true;
                    if(plan[height][pg.x][pg.y].type === "plate" && !pg.toDie){
                        rotateMir(PI/2, plan[height][pg.x][pg.y].color);
                        activePlate.x = pg.x;
                        activePlate.y = pg.y;
                    }
                    else{
                        activePlate.x = -1;
                        activePlate.y = -1;
                    }
                    if(plan[height][pg.x][pg.y].type === "ladder" && !pg.toDie){
                        height = plan[height][pg.x][pg.y].destination;
                        displayHeight = true;
                        st_time = new Date().getTime();
                    }
                    checkDieCondition();
                }
            break;
        }
    };

    public.loadRes = function(){
        img.pav = loadImage("pics/gioco_tanga/pav.png");

        img.wall = loadImage("pics/gioco_tanga/wall.png");
        img.junction = loadImage("pics/gioco_tanga/junction.png");

        img.exit = loadImage("pics/gioco_tanga/exit.png");

        img.mirror[1] = loadImage("pics/gioco_tanga/mirror_1.png");
        img.mirror[2] = loadImage("pics/gioco_tanga/mirror_2.png");
        img.mirror[3] = loadImage("pics/gioco_tanga/mirror_3.png");
        img.mirror[4] = loadImage("pics/gioco_tanga/mirror_4.png");
        img.mirror[5] = loadImage("pics/gioco_tanga/mirror_5.png");

        img.plate = loadImage("pics/gioco_tanga/plate.png");
        img.plate_down = loadImage("pics/gioco_tanga/plate_down.png");

        img.lever = loadImage("pics/gioco_tanga/lever.png");

        img.ladder_up = loadImage("pics/gioco_tanga/ladder_up.png");
        img.ladder_down = loadImage("pics/gioco_tanga/ladder_down.png");

        img.pg_front_idle = loadImage("pics/gioco_tanga/pg_front_idle.png");
        img.pg_back_idle = loadImage("pics/gioco_tanga/pg_back_idle.png");
        img.pg_left_idle = loadImage("pics/gioco_tanga/pg_left_idle.png");
        img.pg_right_idle = loadImage("pics/gioco_tanga/pg_right_idle.png");

        img.explosion = loadImage("pics/gioco_tanga/explosion.png");

        sound.theme = loadSound("audio/gioco_tanga/ost.mp3");
        sound.explosion = loadSound("audio/gioco_tanga/explosion.mp3");
    };



    return public;//sempre ritornare public
})();
