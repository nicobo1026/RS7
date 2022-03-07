 //=============================================================================
// Mano_ActorCopyEvent.js
// ----------------------------------------------------------------------------
// Copyright (c) 2020-2020 Sigureya
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/Sigureya/
// [github]:https://github.com/Sigureya/RPGmakerMV
//=============================================================================
/*:
 * @plugindesc アクターの歩行グラフィックをコピーするプラグイン
 * @author しぐれん
 *
 * @help
 * 「キャラクターの動作指定」→「スクリプト」で以下の内容を書きこんでください。
 * 
 * ■使い方
 * 以下のようなイベントコマンドで行えます。
 * ・パーティの1番目のキャラに変身する
 * ◆移動ルートの設定：このイベント (ウェイト)：
 *                   ：◇スクリプト：this.copyFromMember(0);
 * 
 * ・番号3のアクターに変身する
 * ◆移動ルートの設定：このイベント (ウェイト)：
 *                   ：◇スクリプト：this.copyFromActor(3);
 * 
 * 指定したアクターが存在しない場合、イベントの見た目は変更されません。
 * 上記のスクリプト(関数)は戻り値としてコピーが成功したかどうかを返します。
 * 以下は書き換えが成功したかどうかをスイッチに書き込むサンプルです。
 * $gameSwitches.setValue(switch番号,this.copyFromMember(0))
 * 
 * 
 */
(function(){
    'use strict';
/**
 * 
 * @param {Game_Character} event 
 * @param {Game_Actor} actor 
 */
function copyEvent(event,actor){
    if(actor){
        event.setImage(actor.characterName(),actor.characterIndex());
        return true;
    }
    return false;
}

/**
 * @param {Number} actorId 
 */
Game_Character.prototype.copyFromActor =function(actorId){
    const actor = $gameActors.actor(actorId);
    return copyEvent(this,actor);
};

/**
 * @param {Number} memberIndex
 */
Game_Character.prototype.copyFromMember =function(memberIndex){
    const actor = $gameParty.members()[memberIndex];
    return copyEvent(this,actor);
};

})();
