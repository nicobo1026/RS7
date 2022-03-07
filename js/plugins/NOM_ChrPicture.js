//=============================================================================
// NOM_ChrPicture.js  2020/07/18
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc 立ち絵表示プラグイン
 * @author Nomoa
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 */

(function(_global) {
    // プラグインコマンドの定義

    var pluginName = 'ChrPic'
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    var newPicName = null;
    var shownPicName = null;
    
    Game_Interpreter.prototype.pluginCommand = function(command, args){
	_Game_Interpreter_pluginCommand.call(this, command, args);
 
	if(command === pluginName){
	    switch(args[0]){
	    case 'show':
		showChrPicture(args[1]);
		break;
	    };
	};
    };
    // $gameScreen.showPicture(番号,"画像の名前",原点,x座標,y座標,幅の拡大率,高さの拡大率,不透明度,合成方法) に注意せよ
    // プラグインコマンドshow：ピクチャ表示
    function showChrPicture(ChrPictureName){
        newPicName = ChrPictureName;
        if (newPicName == shownPicName) {

        }else{
            $gameScreen.showPicture(4,ChrPictureName,0,286,27,100,100,0,0);
            $gameScreen.movePicture(4,0,286,27,100,100,255,0,20);
            shownPicName = newPicName;
        };
    };

})(this);