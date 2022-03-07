//=============================================================================
// NOM_MessageWindowPosition.js  2021/05/13
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc 購入専用ショップ設定プラグイン
 * @author Nomoa
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 */

(function() {
    'use strict';

    var _Window_ShopCommand_maxCols = Window_ShopCommand.prototype.maxCols;
    Window_ShopCommand.prototype.maxCols = function() {
        var columnNumber = _Window_ShopCommand_maxCols.apply(this, arguments);
        return this._purchaseOnly ? columnNumber - 1 : columnNumber;
    };

    var _Window_ShopCommand_makeCommandList = Window_ShopCommand.prototype.makeCommandList;
    Window_ShopCommand.prototype.makeCommandList = function() {
        _Window_ShopCommand_makeCommandList.apply(this, arguments);
        if (this._purchaseOnly) {
            this._list = this._list.filter(function(command) {
                return command.symbol !== 'sell'
            });
        }
    };
})();