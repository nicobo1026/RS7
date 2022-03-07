//=============================================================================
// NOM_MessageWindowPosition.js  2021/05/13
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc メッセージウィンドウ位置調整プラグイン
 * @author Nomoa
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 */

(function() {
    'use strict';

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
      var ret = _Game_Interpreter_pluginCommand.apply(this, arguments);
      if (command == N) {
        if (args[0] == "show_id") {
          if (args[1] == "on") {
            show_id = 1;
          } else if (args[1] == "off") {
            show_id = 0;
          }
        }
      }
      return ret;
    };

    //-----------------------------------------------------------------------------
// Sprite_Character
//
// The sprite for displaying a character.

Sprite_Character.prototype.setCharacterBitmap = function() {
    
    this.bitmap = ImageManager.loadCharacter(this._characterName);
    
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};
