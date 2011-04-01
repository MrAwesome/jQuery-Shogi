// Filename: shogi.js
// Author: Glenn Hope
// Email: <hopega@email.wofford.edu>
//
// A simple shogi board in javascript

// Globals
RANKS = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
COLORS = [ "#FFFFFF", "#DDDDDD", "#BBBBBB", "#999999", "#777777", "#666666", "#555555", "#444444", "#333333" ]

// Adding .repeat function for strings
String.prototype.repeat = function( num )
{
        return new Array( num + 1 ).join( this );
}

pieces = function () {}
pieces.prototype = function() {
    this.name = "";
    this.letter = "";
    this.promoted = false;
    this.promote = function() {
        if (this.promotable == true)
            this.promoted = true;
    };
    this.getAttackCoords = function() {
        var coords = [];
        if (this.promoted == true)
            atc = this.promotedAttackCoords;
        else
            atc = this.attackCoords;

        for (i in atc) {
            var r = parseInt(atc[i][0]) + parseInt(this.rank);
            var f = parseInt(atc[i][1]) + parseInt(this.file);
            coords.push([r,f]);
        }

        if (this.generateAttackCoords != undefined) {
            coords = coords.concat(this.generateAttackCoords());
        }

        return coords;
    }
    this.highlightTargets = function () {
        var coords = this.getAttackCoords();
        for (i in coords) {
            r = coords[i][0];
            f = coords[i][1];
            if (((r >= 0) && (r < 9)) && ((f >= 0) && (f < 9)))
                board[r][f].highlight();
        }
    }
}
pieces.empty = function () {
    prot = new pieces.prototype();
    return prot;
}
pieces.king = function () {
    prot = new pieces.prototype();
    prot.name = "King"
    prot.letter = "K"
    prot.promotable = false;
    prot.attackCoords = [
        [-1,-1], //Top Left
        [-1, 0], //Top Middle
        [-1, 1], //Top Right
        [ 0,-1], //Left
        [ 0, 1], //Right
        [ 1,-1], //Bottom Left
        [ 1, 0], //Bottom Middle
        [ 1, 1]  //Bottom Right
    ];
    return prot;
}
pieces.gold = function () {
    prot = new pieces.prototype();
    prot.name = "Gold"
    prot.letter = "G"
    prot.promotable = false;
    prot.attackCoords = [
        [-1,-1], //Top Left
        [-1, 0], //Top Middle
        [-1, 1], //Top Right
        [ 0,-1], //Left
        [ 0, 1], //Right
        [ 1, 0], //Bottom Middle
    ];
    return prot;
}
pieces.silver = function () {
    prot = new pieces.prototype();
    prot.name = "Silver"
    prot.letter = "S"
    prot.promotable = false;
    prot.attackCoords = [
        [-1,-1], //Top Left
        [-1, 0], //Top Middle
        [-1, 1], //Top Right
        [ 1,-1], //Bottom Left
        [ 1, 1]  //Bottom Right
    ];
    return prot;
}
pieces.knight = function () {
    prot = new pieces.prototype();
    prot.name = "Knight"
    prot.letter = "N"
    prot.promotable = true;
    prot.promotedAttackCoords = pieces.gold.attackCoords;
    prot.attackCoords = [
        [-2,-1], //Jump Left
        [-2, 1], //Jump Right
    ];
    return prot;
}
pieces.lance = function () {
    prot = new pieces.prototype();
    prot.name = "Lance"
    prot.letter = "L"
    prot.promotable = true;
    prot.promotedAttackCoords = pieces.gold.attackCoords;
    prot.attackCoords = [];
    prot.generateAttackCoords = function() {
        var rank = this.rank;
        var file = this.file;
        // Up
        coords = []
        for (var r=rank-1;r>=0;r--) {
            coords.push([r,file]);
        }
        return coords;
    }

    return prot;
}
pieces.pawn = function () { 
    prot = new pieces.prototype();
    prot.name = "Pawn"
    prot.letter = "P"
    prot.promotable = true;
    prot.promotedAttackCoords = pieces.gold.attackCoords;
    prot.attackCoords = [[-1,0]];
    return prot;
}
pieces.rook = function () {
    prot = new pieces.prototype();
    prot.name = "Rook"
    prot.letter = "R"
    prot.promotable = true;
    prot.generateAttackCoords = function() {
        var rank = parseInt(this.rank);
        var file = parseInt(this.file);
        var coords = [];
        
        // Down
        for (var r=rank+1;r<9;r++) {
            coords.push([r,file]);
        }

        // Right
        for (var f=file+1;f<9;f++) {
            coords.push([rank,f]);
        }

        // Up
        for (var r=rank-1;r>=0;r--) {
            coords.push([r,file]);
        }

        // Left
        for (var f=file-1;f>=0;f--) {
            coords.push([rank,f]);
        }

        return coords;
    }
    prot.attackCoords = [];
    prot.promotedAttackCoords = [
        [-1,-1], //Top Left
        [-1, 1], //Top Right
        [ 1,-1], //Bottom Left
        [ 1, 1]  //Bottom Right
    ];
    return prot;
}
pieces.bishop = function () {
    prot = new pieces.prototype();
    prot.name = "Bishop"
    prot.letter = "B"
    prot.promotable = true;
    prot.generateAttackCoords = function() {
        var rank = parseInt(this.rank);
        var file = parseInt(this.file);
        var coords = [];

        // Down/Right
        var f = file+1;
        for (var r=rank+1;(r<9 && f<9);r++) {
            coords.push([r,f]);
            f++;
        }
        
        // Up/Right
        var f = file-1;
        for (var r=rank+1;(r<9 && f>=0);r++) {
            coords.push([r,f]);
            f--;
        }

        // Down/Left
        var f = file+1;
        for (var r=rank-1;(r>=0 && f<9);r--) {
            coords.push([r,f]);
            f++;
        }
        
        // Up/Left
        var f = file-1;
        for (var r=rank-1;(r>=0 && f>=0);r--) {
            coords.push([r,f]);
            f--;
        }

        return coords;
    }
    prot.attackCoords = [];
    prot.promotedAttackCoords = [
        [-1, 0], //Top Middle
        [ 0,-1], //Left
        [ 0, 1], //Right
        [ 1, 0], //Bottom Middle
    ];
    return prot;
}

// Object representing a shogi square
shogiSquare = function() {
    this.highlighted = 0;
    this.highlight = function() {
        this.highlighted++;
    }
    this.unhighlight = function() {
        this.highlighted--;
    }

}
shogiBoard = function() {
    this.getSquare = function(rank, file) {
        if (rank.length == 2) {
            file = rank[1];
            rank = rank[0];
        }
        return this[rank][file];
    }
    this.setSquare = function(rank, file, piece) {
        if (rank.length == 2) {
            piece = file;
            file = rank[1];
            rank = rank[0];
        }
        var sq = this[rank][file];
        piece.rank = rank;
        piece.file = file;
        sq.piece = piece;
    }
    for (rank=0;rank<9;rank++) {
        var rankobj = {};
        this[rank] = rankobj;
        this[RANKS[rank]] = rankobj;
        for (file=0;file<9;file++) {
            var sq = new shogiSquare();
            sq.rank = rank;
            sq.file = file;
            sq.piece = new pieces.prototype();
            this[rank][file] = sq;
        }
    }
    return this;
}

board = new shogiBoard();

function generateHtmlBoard(board) {
    var html = "<table>";
    for (var rank=0;rank<9;rank++) {
        html += "<tr class='rank' id='" + rank.toString() + "'>";
        for (var file=0;file<9;file++) {
            var sq = board[rank][file];
            html += "<td class='file hitby" + sq.highlighted + "' id='" + file.toString() + "'>";
            html += sq.piece.letter;
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "<table>";
    return html;
}
function style() {
    var w = 33;
    var h = 33;
    $(".file").css({
        "border": "1px solid black",
        "width": w.toString() + "px",
        "height": h.toString() + "px",
        "margin-left": "auto",
        "margin-right": "auto",
        "text-align": "center"
    });
    $("#selected").css({
        "position": "absolute",
        "left": (w*12).toString() + "px",
        "top": "20px",
        "border": "2px solid green"
    });
    for (var i=0;i<9;i++) {
        $(".hitby" + i.toString()).css("background-color", COLORS[i]);
    }
}
function setPiece(board, piece, rank, file) {
        board.setSquare(rank, file, piece);
        piece.highlightTargets();
}
function clickToPlace(piece) {
    $("#selected").html(piece().letter + ": " + piece().name);
    style();
    $(".file").unbind("click");
    $(".file").click(function() {
        var p = new piece;
        var rank = $(this).parent().attr("id");
        var file = $(this).attr("id");
        setPiece(board, p, rank, file);
        var html = generateHtmlBoard(board);

        $("#board").html(html);
        clickToPlace(piece);
        style();
    });
}
function getRandColor() {
    hex = "#";
    colorval = (16777215 * Math.random()).toString();
    for (ch=0;ch<6;ch++)
        hex += colorval[ch];
    return hex 
}

$(document).ready(function() {
    var html = generateHtmlBoard(board);
    $("#board").html(html);
    style();
    clickToPlace(pieces.pawn);
    $(window).keypress(function(event) {
        var kp = event.which;
        var chr = String.fromCharCode(kp);
        if ((chr == "p") || (chr == "P")) 
            clickToPlace(pieces.pawn);
        else if ((chr == "l") || (chr == "L")) 
            clickToPlace(pieces.lance);
        else if ((chr == "n") || (chr == "N")) 
            clickToPlace(pieces.knight);
        else if ((chr == "s") || (chr == "S")) 
            clickToPlace(pieces.silver);
        else if ((chr == "g") || (chr == "G")) 
            clickToPlace(pieces.gold);
        else if ((chr == "k") || (chr == "K")) 
            clickToPlace(pieces.king);
        else if ((chr == "r") || (chr == "R")) 
            clickToPlace(pieces.rook);
        else if ((chr == "b") || (chr == "B")) 
            clickToPlace(pieces.bishop);
    });
});
