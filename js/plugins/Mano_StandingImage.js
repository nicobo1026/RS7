
 //=============================================================================
// Mano_StandingImage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2018-2018 Sigureya
// 非商用の範囲では無料です。
// 商用利用の場合、別途ライセンス必要です。
// (3000円以下に抑えます)
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/Sigureya/
// [github]:https://github.com/Sigureya/RPGmakerMV
// ----------------------------------------------------------------------------
//=============================================================================

/*:
 * @plugindesc 表情連動型立ち絵プラグインです。
 * ピクチャーに張り付けた顔を文章の表示コマンドから制御します。
 * @author しぐれん(https://github.com/Sigureya/RPGmakerMV)
 * 
 * @param testData
 * @type struct<StandingImage>
 * 
 * @param list
 * @type struct<StandingImage>[]
 * 
 * @param list2
 * @desc リストが長くなってきたときのための退避場所です。
 * @type struct<StandingImage>[]
 * 
 * 
 * @param actorSetting
 * @desc 廃止予定
 * @text （廃止予定）アクター用の設定
 * @type struct<ActorSetting>[]
 * @default []
 * 
 * @param statePriority
 * @desc ステートと表情の対応優先順位です。
 * 上から順にチェックしていきます。
 * @type State[]
 * @default []
 * 
 * 
 * @param defaultOpacity
 * @desc プラグインコマンドを実行した直後の立ち絵の透明度です。
 * 「ピクチャーの移動」の透明度と同様です。
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * 
 * @param usingEditMode
 * @desc 立ち絵設定モードの有効化設定
 * @type boolean
 * @defaut true
 * 
 * @param editModeSymbol
 * @desc 立ち絵編集モードのシンボルです。
 * 基本的には変更不要です。
 * @type string
 * @default StandingImageEdit
 * 
 * @help
 * 立ち絵用の画像をimg/pictures/フォルダに入れてください。
 * 
 * プラグインパラメータで設定した後で、「ピクチャーの表示」を使うことで表示されます。
 * 「文章の表示」で使用される顔画像がいい感じに組み込まれます。
 * 
 * ■プラグインパラメータ
 * ・name
 * 呼び出す立ち絵を決めるために使います。
 * 使う文字に制限はありませんが、重複すると正しく動作しません。
 * ・face
 * 顔グラフィックを指定します。
 * 
 * あとは、プラグインパラメータをクリックしていい感じに設定してください。
 * ゲームを起動して立ち絵設定のコマンドを開くと、
 * ゲームを動かしながら表示テストができます。
 * 
 * ■faceX/faceYの設定について
 * 座標系がやや特殊ですが、使い道を想定してこうなっています。
 * 立ち絵は基本的に顔が中心となる設計が多いと見て、0で中央になるようにしています。
 * Y軸は身長などの違いによって異なる可能性が高いため
 * 画像の一番上を0にしています。
 * とりあえず、0,0に設定すればそれなりにいい数値になるよう設計しています。
 * ※ここ、微妙だったので最新版では異なります。
 * 注意
 * 
 * ■顔画像同期機能
 * イベントコマンド「メッセージの表示」によって
 * 指定した顔グラフィックを立ち絵に反映できます。
 * 
 * ■立ち絵調整モード
 * 主に頭の位置を調整するためです。
 * 方向キーを使って動かします。
 * シフトキーを押しながら方向キーで1ずつ調整できます。
 * セーブする機能はないので、数値を見ながらプラグインパラメータを書き換えてください。
 * 
 * 
 * ■利用規約について
 * 非商用の範囲では無料で利用OKです。
 * 商用（ゲームの配布が有償となる場合）ば1サークル当たり1つのライセンスが必要です。
 * その際、報告を必須とします。
 * 販売しているサイトのURLをTwitterまたはメールでお伝えください。
 * このプラグインを公開した段階では準備できていないので、あとで更新します。
 * 
 * ■更新履歴
 * 
 * ver 1.0.1
 * ヘルプ文章が更新されていなかったので修正。
 * ver 1.0.0
 * セーブデータに関わる部分を一時変更。
 * 互換が切れたかもしれない。
 * 
 * ver 0.9.5
 * 立ち絵の表示をピクチャーの表示から行うよう変更
 * プラグインコマンドを不要に
 * 
 * 
 * ver 0.9.3 2018/03/31
 * 戦闘中の立ち絵を無効化する機能
 * 不透明な顔グラが正しく動く機能
 * 
*/

/**
 * TODO
 * 戦闘中立ち絵が、パラメータ不足の時にぬるぽして落ちる
 * クラス設計含めて、再検討が必要
 * 戦闘中の立ち絵と編集モードの立ち絵の機能を統合する
 * 
 */
 /*~struct~StndingImageSet:
 * @param image
 * @desc メインの立ち絵画像を設定します。
 * @type file
 * @dir img/pictures/
 * 
 * @param faceX
 * @desc 顔画像のX位置です。
 * 画像中央を0とした位置を設定します。
 * @type number
 * @default 0
 * @min -9999
 * 
 * @param faceY
 * @desc 顔画像のX位置です。
 * 顔画像の上を0とした位置を設定します。
 * @type number
 * @default 0
 * @min -9999
 * 
 */


/*~struct~StatePair:
 * @param state
 * @type state
 * 
 * @param faceIndex
 * @desc 戦闘に勝利したときの顔画像です
 * @type number
 * @min 0
 * @max 7
 * @default 0
 * 
 */

 /*~struct~performPair:
 * @param perform
 * @type combo
 * @option damage
 * @option victory
 * @option item
 * @option guard
 * @option spell
 * 
 * @param faceIndex
 * @desc performで指定した動きを取るときの顔番号です
 * @type number
 * @min 0
 * @max 7
 * @default 0
 * 
 */
/*~struct~StandingImage:
 * 
 * @param standingImageList
 * @desc 追加の立ち絵です。
 * ポーズを変えたい場合などに使ってください。
 * @type  struct<StndingImageSet>[]
 * @default []
 * 
 * @param standingImage
 * @desc メインの立ち絵画像を設定します。
 * @type file
 * @dir img/pictures/
 * 
 * @param face
 * @desc 顔画像です。
 * デフォルトの顔グラフィックを利用します。
 * @type file
 * @dir img/faces/
 * 
 * @param faceList
 * @desc 顔画像です。
 * デフォルトの顔グラフィックを利用します。
 * @type file[]
 * @dir img/faces/
 * @default []
 * 
 * 
 * @param faceX
 * @desc 顔画像のX位置です。
 * 画像中央を0とした位置を設定します。
 * @type number
 * @default 0
 * @min -9999
 * 
 * @param faceY
 * @desc 顔画像のX位置です。
 * 顔画像の上を0とした位置を設定します。
 * @type number
 * @default 0
 * @min -9999
 * @help
 * 
 */
/**
 * 
 * Window_Message.prototype.drawMessageFace
 * ここを改造して、顔画像を割り当てる設計に？
 * ↑この部分、実際に読み込み待ちしている
 * 
 * TODO
 * 戦闘時の表情を切り替えるコマンド
 * 立ち絵のレイヤー調整
 * 
 * 
 * 戦闘中の立ち絵に関するシステムを新しい方に変更して再実装
 * データの関連付けを、アクターデータの顔グラフィックを使い自動化
 * 
 * 
 * 設定データの管理方法
 * 立ち絵+座標+表情リストの群れで管理
 * 表情から立ち絵スプライトを検索
 * 立ち絵の名前から立ち絵スプライトを検索
 * 
 * 2か所に登録するのがいいか。
 * 立ち絵ならピクチャー番号から引けるので、それを利用する。
 * 
 * 
 * ピクチャーの表示
 * ↓
 * const picture = getPicture(picID);
 * if(picture){
 * 
 * }
 * const stdImage =get(立ち絵のファイル名);
 * if(stdImage)){
 *    if(その番号のピクチャは既に立ち絵を用意している？){
 *        
 *    }
 *    
 * 
 * }
 * 
 */


 
var Mano_StandingImage = (function(){    
    'use strict'
class Game_ChildPicture_MA {
    constructor() {
        this.initialize();
    }
    initialize() {
        this.setup('', 0);
    }
    /**
     * @param {String} standingImage
     * @param {String} facename
     * @param {Number} index
     */
    setup( standingImage, facename, index) {
        this.changeFace(facename, index);
        this.changeStandingImage(standingImage);
    }
    /**
     * @param {String} imageName
     */
    changeStandingImage(imageName) {
        this._standingImageName = imageName;
        this.setStandingImageChange(true);
    }
    /**
     * @param {Number} id
     */
    changeStandingImageById(id) {
        
    }
    /**
     * 
     * @param {String} face 
     * @param {Number} index 
     */
    changeFace(face, index) {
        this._faceIndex = index;
        this._faceFileName = face;
        this.setFaceChanged(true);
    }
    /**
     * @return {String}
     */
    standingImage() {
        return this._standingImageName;
    }
    /**
     * @return {String}
     */
    facename() {
        return this._faceFileName;
    }
    /**
     * @return {Number}
     */
    index() {
        return this._faceIndex;
    }
    /**
     * @return {String}
     */
    setFaceChanged(value) {
        this._faceChanged = !!value;
    }
    hasFaceChanged() {
        return this._faceChanged;
    }
    setStandingImageChange(value) {
        this._standingImageChanged = !!value;
    }
    hasStandingImageChanged() {
        return this._standingImageChanged;
    }
}
window[Game_ChildPicture_MA.name] = Game_ChildPicture_MA;


function getParamator(){
    return PluginManager.parameters("Mano_StandingImage");
};
if(!getParamator()){
    console.log("plugin paramator undefined(Mano_StandingImage)");
    return;
}

function makeKVP(key,value){
    return '\\"'+key+'\\":\\"'+value+'\\"';
}


class Data_StandingImage_XXX{
    /**
     * @param {String} name 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(name,x,y){
        this.name =name;
        this.x=x;
        this.y=y;
    }
};

class Data_StandingImage{
    /**
     * @param {String} standingImage 
     * @param {Number} faceX 
     * @param {Number} faceY 
     * @param {String[]} faceList 
     */
    setup(standingImage,faceX,faceY,faceList){
        this.standingImage =standingImage;
        this.faceX =faceX;
        this.faceY = faceY;
        this.faceList =faceList;
    }
    constructor(){

        this.standingImage="";
        this.faceX=0;
        this.faceY=0;
        this.faceList=[];
    }

    /**
     * @param {String[]} list
     */
    setFaceList(list){
        this.faceList =list;
    }

    getStandingImage(){
        return this.standingImageList[0];
    }
    get face(){
        return this.faceList[0];
    }
    /**
     * @param {Data_StandingImage} other 
     */
    static copyConstructe(other){
        const result = new Data_StandingImage();
        result.name = other.name;
        result.face = other.face;
        result.faceX = other.faceX;
        result.faceY = other.faceY;
        result.faces =other.faces.clone();
        return result;
    }
    clone(){
        const result= new Data_StandingImage();
        result.standingImage = this.standingImage;
        result.face= this.face;
        result.faces = this.faces.clone();
        result.faceX=this.faceX;
        result.faceY=this.faceY;
        return resul; 
    }
    /**
     * 
     * @param {String} image 
     */
    setStandingImage(image){
        this.standingImage =image;
    }
    /**
     * @return {String[]}
     */
    static readFaceList(data){

        if(!data.faceList){return []};
        const obj = JSON.parse(data.faceList);
        return obj;
    }

    /**
     * 
     * @return {Data_StandingImage_XXX[]} data 
     */
    static readStandingImageList(data){
        if(!data.standingImageList){return [];}
        const result=[];
        const list =JSON.parse(data.standingImageList);
        for (const std of list) {

            result.push(new Data_StandingImage_XXX(
                std.standingImage,
                Number(std.faceX),
                Number(std.faceY)
            ));
        }
        return result;
    }


    makeFromJSON(data){
        this.standingImageList = Data_StandingImage.readStandingImageList(data);

        this.faceList = Data_StandingImage.readFaceList(data);
        if(data.face){
           // console.log("faceの方で顔グラ設定するのあとで廃止するので、faceListに移して\n"+data.face);
            this.faceList.unshift(data.face);
        }
        this.dead = Number(data.dead);
        /**@type {String} */
        this.setStandingImage (data.standingImage);
        this.standingImageList.push(data.standingImage);
        this.faceX = Number(data.faceX);
        this.faceY = Number(data.faceY);
    }
    standingFullPath(){
        return setting.baseDir+this.standingImage;
    }
};

class Game_StandingImage extends Data_StandingImage{
//    load

};


//データ生成用スクリプト 後で使う時に備えて残してある
(function(){
    return;
    const result =[];
    const data = new Data_StandingImage();
    for(var i =24; i<204;++i){
        const val = i.toString();
        const imageId =('000'.slice(val.length))+val;
        data.face = 'yhmv'+imageId;
        data.standingImage = "yh" +imageId;
        data.name = "yh" + imageId;
        const tmp = [
            makeKVP("name",data.name),
            makeKVP("standingImage",data.standingImage),
            makeKVP("face",data.face),
            makeKVP("faceX",0),
            makeKVP("faceY",0)
        ];
        const objText ='"{'+ tmp.join(',')+'}"';
        result.push(objText);
    };
    const final ='['+result.join(',') +']';
    console.log(final);
})();



function readStandingImageJSON(data){
    const obj =JSON.parse(data);
    const stdImg =new Data_StandingImage();
    stdImg.makeFromJSON(JSON.parse(data));
    return stdImg;
}
/**
 * @param {*} paramList 
 * @param {function(Data_StandingImage)} func 
 */
function listParameterEach(paramList,func){
    if(!paramList){return;}
    const list= JSON.parse(paramList);
    for (const iterator of list) {
        const obj =readStandingImageJSON(iterator);
        func(obj);
    }
}

// class ActorSetting extends Data_StandingImage{
//     constructor(){
//         super();
//         /**
//          * @type {Map<Number,Number>}
//          */
//         this.stateMap =new Map();
//         this.performMap ={};
//     }
    
//     /**
//      * @param {String} actionName 
//      * @param {Number} faceIndex 
//      */
//     addPerform(actionName,faceIndex){   
//         if(!isNaN(faceIndex  )){
//             this.performMap[actionName]=faceIndex;
//         }
//     }
//     /**
//      * @param {Game_Actor} actor 
//      */
//     getStateFace(actor){
//         for (const stateId of setting.statePriority) {
//             if(actor.isStateAffected(stateId)){
//                 const id= this.stateMap.get(stateId);
//                 return id;
//             }
//         }
//         return 0;
//     }
//     /**
//      * @param {Number} stateId 
//      * @param {Number} faceIndex 
//      */
//     addStateFace(stateId,faceIndex){
//         this.stateMap.set(stateId,faceIndex);
//     }
//     makePerformPairList( data){
//         if(!data){return;}
//         const list =JSON.parse(data);
//         const len = list.length;
//         for(var i =0; i< len; ++i){
//             const pair = JSON.parse(list[i]);
//             this.addPerform(pair.perform,Number(pair.faceIndex));
//         }
//     }
//     makeStateList(data){        
//         if(!data){return;}
//         const list =JSON.parse(data);
//         const len = list.length;
//         for(var i =0; i< len; ++i){
//             const pair = JSON.parse(list[i]);
//             this.addStateFace(Number(pair.state),Number(pair.faceIndex));
//         }
//     }

//     static createFaceList(list){


//     }

//     makeFromJSON(data){
//         super.makeFromJSON(data);
//         this.dead = Number(data.dead);
//         this.makeStateList(data.stateList);
//         this.makePerformPairList(  data.performlist);
//         for (let index = 1; index <=7; index++) {
//             const paramName ='faceState'+index;
//             for (const stateId of listParamConvert(data[paramName])) {
//                 this.addStateFace(stateId,index);
//             }
//         }
//     }

//     /**
//      * @param {Number?} actionName 
//      */
//     getPerformFace(actionName){
//         return this.performMap[actionName];
//     }

//     deadFace(){
//         return this.dead;
//     }

// }


class Data_StndingImageSet{
    /**
     * @param {String} image 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(image,x,y){
        this.image = image;
        this.faceX =0;
        this.faceY =0;
    }
}

class Data_StandingImage_Manager{

    constructor(){
        /**
         * @type {Map<String,Data_StandingImage>}
         */
        this._map = new Map();
        this.makeData();
    }
    /**
     * @returns {Data_StandingImage[]}
     */
    createItemList(){
        const result =[];
        this._map.forEach(function(v,k){
            result.push(v);
        });
        return result;
    }
    /**
     * @param {String} text 
     */
    readStandingData(text){

        if(!text){return;}

        const list = JSON.parse(text);
        for (const data of list) {
            this.hageXXX(JSON.parse(data));
        }
    }
    makeData(){
        console.log("makeData");
        const param = getParamator();
        this.readStandingData(param.list);
        this.readStandingData(param.list2);
    }

    /**
     * @return {Data_StandingImage}
     * @param {String} key 
     */
    get(key){
        const data = this._map.get(key);
        return data;
    }
    get size(){
        return this._map.size;
    }

    static toFaceList(obj){
        const result= toStringList(obj.faceList);
        if(obj.face){
            result.push(obj.face);
        }
        return result;
    }


    hageXXX(obj){
        const faceList =  Data_StandingImage_Manager.toFaceList(obj);
        const standingImageList = toStringList(obj.standingImageList);
        this.hageYYY(obj,faceList);

        for (const data of standingImageList) {
            const dataObj =JSON.parse(data);
            const stdImg = new Data_StandingImage();
            stdImg.setup(dataObj.image,
                Number(dataObj.faceX),Number(dataObj.faceY),
                faceList
            );
            this.addData(stdImg);
        }
    }
    hageYYY(obj,faceList){
        if(obj.standingImage){
            const stdImg=new Data_StandingImage();
            stdImg.setup(obj.standingImage,
                Number(obj.faceX),Number(obj.faceY),
                faceList
            );
            this.addData(stdImg);
        }
    }

    /**
     * 
     * @param {Data_StandingImage} data 
     */
    addData(data){

        if(data.standingImage){
            this._map.set(data.standingImage,data);
        }else{
            this;
        }

    }
}

function listParamConvert(paramList){
    if(!paramList){return [];}
    const result  = JSON.parse(paramList).map(function(data){
        return JSON.parse(data);
    });
    return result;
}


function createSetting(){

    const param = getParamator();
    const result ={
        baseDir:'img/pictures/',
        list:new Data_StandingImage_Manager(),//readList(  param),
        defaultOpacity:Number(param.defaultOpacity),
        autoDelete:true,
        /** @type {number[]}  */
        statePriority: listParamConvert(param.statePriority),
        usingEditMode:!(param.usingEditMode ==="false"),
        /**
         * @type {string}
         */
        editModeSymbol:(param.editModeSymbol || "stdEdit"),

    };
    return result;
};

const setting =createSetting();
//var setting =null;
/**
 * @returns {String[]}
 */
function toStringList(arg){
    if(!arg){return[];}

    return JSON.parse(arg);
}



/**
 * 
 * @param {String} name 
 */
function standingFullPath(name){
    return setting.baseDir+name;
}

/**
 * @param {String} key 
 * @return {Data_StandingImage}
 */
function getStandingImage(key){

    return setting.list.get(key);
}



/**
 * @param {Game_Picture} picture
 * @param {Data_StandingImage} stdImage
 */
function Picture_setStandingImage(picture,stdImage){
    const child = new Game_ChildPicture_MA();
    child.setup(stdImage.standingImage,stdImage.face,0);
    picture._childPicture  =child;
}


/**
 * @param {Game_Picture} picture 
 * @param {String} faceName 
 * @param {Number} index 
 */
function Picture_ChangeFace(picture,faceName,index){
    if(picture._childPicture){
        picture._childPicture.changeFace(faceName, index);
        return true;
    }
    return false;
}

/**
 * @param {Bitmap} bitmap 
 * @param {Number} y
 * @param {Number} x
 */
function init_xxBitmap_imple(bitmap,x,y){
    bitmap.clearRect(x,y,144,144);
}

/**
 * @param {Sprite_Picture} spritePicture 
 * @param {Game_ChildPicture_MA} child
 * @param {Data_StandingImage} stdImage
 * @returns {Sprite_Face}
 */
function addFaceSprite(spritePicture,child,stdImage){
    if(spritePicture._faceSprite){
        return spritePicture._faceSprite;
    }
    const faceSprite = new Sprite_Face();
    faceSprite.x = stdImage.faceX;
    faceSprite.y = stdImage.faceY;

    spritePicture._faceSprite = faceSprite;
    spritePicture.addChild(faceSprite);

    return faceSprite;
}

/**
 * @param {Sprite_Picture} spritePicture 
 * @param {Game_ChildPicture_MA} child
 * 
 * @desc 多重読み込みガードは外でやっているので注意ね
 */
function Sprite_Picture_loadFace(spritePicture,child){
    const stdName =child.standingImage();
    const p = spritePicture.picture();
    const stdImage = getStandingImage(stdName);
    if(!stdImage){
        const errorText = stdName +'は対応表に無いぞ';
        throw new Error(errorText);
    }
    
    spritePicture._pictureName =stdName;
    spritePicture.bitmap =loadStandingBitmap_MA_V3(stdImage);

    const f = addFaceSprite(spritePicture,child,stdImage);
    
    $StandingPictureManager.addPicture_V2(spritePicture,stdImage)
}
/**
 * @param {Sprite_Picture} sprite \
 * @param {Sprite_Face} face
 * @param {Game_ChildPicture_MA} xxx 
 */
function SpritePicture_setStandingImage(sprite,face,xxx){
    const stdImg =   getStandingImage(xxx.standingImage());
    if(stdImg){
        sprite.bitmap = loadStandingBitmap_MA_V3(stdImg);
        face.x = stdImg.faceX;
        face.y = stdImg.faceY;
        xxx.setStandingImageChange(false);
    }
}

/**
 * @param {Sprite_Face} face
 * @param {Game_ChildPicture_MA} child 
 */
function SpritePicture_ChangeFace(face,child){
    const bmp = ImageManager.loadFace(child.facename());
    if(bmp.isReady()){
        face.setBitmap(bmp);
        face.setFaceId(child.index());
        child.setFaceChanged(false);
    }
}

Sprite_Picture.prototype.updateChildPicture_MA =function(){
    const picture = this.picture();

    if(!picture){
        this.eraceFace_MA();
        return;
    }
    /** 
     *@type {Game_ChildPicture_MA}
    */
    const child = picture._childPicture;
    if(!child){
        this.eraceFace_MA();
        return;
    }

    if(!this._faceSprite){
        Sprite_Picture_loadFace(this,child);
    }
    /**
     * @type {Sprite_Face}
     */
    const face =this._faceSprite;
    if(face ){
        if(child.hasStandingImageChanged()){
            SpritePicture_setStandingImage(this,face,child);            
        }
        if(child.hasFaceChanged()){
            SpritePicture_ChangeFace(face,child);
        }
    }
}

const Sprite_Picture_updateTone =Sprite_Picture.prototype.updateTone;
Sprite_Picture.prototype.updateTone =function(){
    Sprite_Picture_updateTone.call(this);
    if(this._faceSprite){
        const picture = this.picture();
        const tone = picture.tone();
        if(tone){
            this._faceSprite.setColorTone(tone);
        }
    }
};

Sprite_Picture.prototype.faceName_MA=function(){
    if(this._faceSprite){
        return [this._faceSprite.faceName];
    }
    return [];
}


const Sprite_Picture_updateBitmap=Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap =function(){
    this.updateChildPicture_MA();
    Sprite_Picture_updateBitmap.call(this);
};

Sprite_Picture.prototype.eraceFace_MA =function(){
    if(!!this._faceSprite ){
        this.removeChild(this._faceSprite);
        this._faceSprite =null;
    }
}

class Sprite_Face extends Sprite{

    constructor(){
        super();
        this.faceName =null;
        this.setFaceId(0);
    }

    /**
     * @param {Bitmap} bitmap 
     */
    setBitmap(bitmap){
        this.bitmap =bitmap;
        this.updateFrame();
    }

    faceWidth(){
        return Window_Base._faceWidth;
    }
    faceHeight(){
        return Window_Base._faceHeight;
    }
    /**
     * @param {Data_StandingImage} data 
     */
    setStandingImageDefine(data){
        this.setFace(data.face);
        this.x = data.faceX;
        this.y = data.faceY;
    }


    /**
     * @param {String} faceName 
     */
    setFace(faceName){

        if(faceName ===this.faceName){
            return;
        }
        this.faceName =faceName;
        const bitmap =ImageManager.loadFace(faceName);
        if(!bitmap.isReady()){
//            throw(new Error("読み込みが完了していない"));
        }
        this.bitmap=bitmap;
        this.updateFrame();
    }
    setFaceId(faceId){
        if(faceId !==this.faceIndex){
            this.faceIndex =faceId;
            this.updateFrame();
        }
    }
    patternY(){
        return (this.faceIndex % 2)===0 ? 0:this.faceHeight;
    }
    updateFrame(){
        const width = this.faceWidth();
        const height = this.faceHeight();
        const sx = this.faceIndex % 4 * width ;
        const sy = Math.floor(this.faceIndex / 4) * height ;
        this.setFrame(sx,sy,width,height);        
    }
};

class Sprite_StandingImage extends Sprite{

    constructor(){
        super();
    }
    initialize(){
        super.initialize();

        const face =new Sprite_Face();
        this.face =face;
        this.addChild(face);
    }

    /**
     * @param {Game_StandingImage} StandingImage 
     */
    setStandingImage(StandingImage){
        if(this.face){
            this.face.setFace(StandingImage.face);
            this.face.x =StandingImage.faceX;
            this.face.y =StandingImage.faceY;
        }
        const path =standingFullPath(StandingImage.standingImage);
        this.bitmap =loadStandingBitmap_MA_V3(StandingImage);
    }

    cutFace(){
        this.bitmap.clearRect(this.face.x,this.face.y,144,144);
    }

    setStandingImageById(id){
        const imageDef=setting.list[id];
        if(!imageDef){return;}
    } 
};


class StandingPictureManager{
    constructor(){
        /**
         * @type {Map<String,Sprite_Picture>}
         */
        this._map =new Map();
        this.setNext(null,null);
    }
    /**
     * 
     * @param {Sprite_Face} sprite
     * @param {Bitmap} bitmap 
     */
    setNext(sprite,bitmap){
        this._sprite =sprite;
        this._nextBitmap=bitmap;
    }

    /**
     * @param {Sprite_Picture} picture 
     * @param {Data_StandingImage} data
     */
    addPicture_V2(picture,data){
        for (const faceName of data.faceList) {
            this;
            if(this._map.has(faceName)){
                console.log(faceName +"が重複しているよ");
            }
            this._map.set(faceName,picture);            
        }

    }
    
    /**
     * @param {Sprite_Picture} picture 
     */
    addPicture(picture){
        /**
         * @type {String[]}
         */
        const faceList = picture.faceName_MA();
        for (const faceName of faceList) {
            if(faceName ){
                this._map.set(faceName,picture);
            }
        }
    }
    clear(){
        for (const data of this._map.values()) {
            $gameScreen.erasePicture( data._pictureId);
        }
        this._map.clear();
        this.setNext(null);
    }
    /**
     * 
     * @param {String} faceName 
     */
    erase(faceName){
        const stdImage = getStandingImage(faceName);

        for (const key of stdImage.faceList) {
            const sprite =this._map.get(key);
            if(sprite){
                sprite.eraceFace_MA();
                this._map.delete(key);    
            }
        }
    }

    isReady(){
        if(this._nextBitmap===null){
            return true;
        }

        return this._nextBitmap.isReady();
    }
    /**
     * @return {Boolean}
     * @desc 読み込み完了なら、trueを返す
     */
    updateLoading(){
        if(this._nextBitmap===null){
            return false;
        }

        if(this._nextBitmap.isReady()){
            this.setNext(null);
            return false;
        }
        return true;
    }

    //メモ　インタプリタのwaitからupdate呼び出し
    // changeでは、次のためのバインドだけを行う
    update(){
        if(this._nextBitmap ===null){
            return false;
        }

    }

    /**
     * @return {boolean}
     * @param {String} faceName 
     * @param {Number} faceIndex 
     */
    changeFaceImage_V2(faceName,faceIndex){
        if(faceName==='' ){
            return false;
        }

        const faceSprite = this._map.get(faceName);
        if(faceSprite  ){

            const pic=faceSprite.picture();
            return Picture_ChangeFace(pic,faceName,faceIndex);
        }
        return false;
    }


    /**
     * @return {boolean}
     * @param {String} faceName 
     * @param {Number} faceIndex 
     */
    changeFaceImage(faceName,faceIndex){
        if(faceName==='' ){
            return false;
        }

        const faceSprite = this._map.get(faceName);
        if(faceSprite  ){
            const pic=faceSprite.picture();
            return Picture_ChangeFace(pic,faceName,faceIndex);
        }
        return false;
    }
};

const $StandingPictureManager = new StandingPictureManager();

const verOrNumberReg=/(V)?(\d+)/i;
/**
 * @return {Number} 
 * @param {String} value 
 */
function verOrNumber(value){
    const match = verOrNumberReg.exec(value);
    if(match){
        if(match[1]){
            return $gameVariables.value(Number(match[2]));
        }else{
            return Number(match[2]);
        }
    }
    return 0;
}


/**
 * 
 * @param {Data_StandingImage} data 
 */
function loadStandingBitmap_MA_V3(data){
    const bmp = ImageManager.loadPicture(data.standingImage);
    init_xxBitmap(bmp,data);
    return bmp;
}
/**
 * @param {Bitmap} bitmap 
 * @param {Data_StandingImage} stdImg
 */
function init_xxBitmap(bitmap,stdImg){
    if(bitmap._MA_stdCut){
        return;
    }
    if(bitmap.isReady()){
        init_xxBitmap_imple(bitmap,stdImg.faceX,stdImg.faceY);
    }else{
        bitmap.addLoadListener(function(){
            init_xxBitmap_imple(bitmap,stdImg.faceX,stdImg.faceY);            
        });
    }
    bitmap._MA_stdCut=true;
}

const ImageManager_requestPicture =ImageManager.requestPicture;
ImageManager.requestPicture =function(filename,hue){
    const bmp = ImageManager_requestPicture.call(this,filename,hue);
    const stdImg = getStandingImage(filename);
    if(stdImg){
        init_xxBitmap(bmp,stdImg);
    }
    return bmp;
};

function ChangeStandingImage(pictureId,newStdImage){
    const picture = $gameScreen.picture(pictureId);
    ImageManager.loadPicture(newStdImage);
    picture._name =newStdImage;
    /**
     * @type {Game_ChildPicture_MA}
     */
    const child = picture._childPicture;
    child.changeStandingImage(newStdImage);
}

/**
 * @param {String} name 
 * @param {Number} faceIndex 
 */
function SetFace(name,faceIndex){
   const stdImg=  getStandingImage(name);
    if(stdImg){
        $StandingPictureManager.changeFaceImage(stdImg.face,faceIndex);
    }
}

const Window_Message_drawMessageFace =Window_Message.prototype.drawMessageFace;
Window_Message.prototype.drawMessageFace =function(){
    const faceName = $gameMessage.faceName();
    const index = $gameMessage.faceIndex();
    const changed =$StandingPictureManager.changeFaceImage(faceName,index);
    if(changed){
        $gameMessage._faceName="";
        this._textState.left =0;
        this._textState.x =0;
    }else{
        Window_Message_drawMessageFace.call(this);
    }
};


const Game_Message_setFaceImage =Game_Message.prototype.setFaceImage;
Game_Message.prototype.setFaceImage =function(faceName, faceIndex){
    const changed = $StandingPictureManager.changeFaceImage(faceName,faceIndex);
    Game_Message_setFaceImage.call(this,faceName,faceIndex);
    if(!changed){
    }
};

const Game_Screen_erasePicture = Game_Screen.prototype.erasePicture;
Game_Screen.prototype.erasePicture =function(pictureId){
    const pic = this.picture(pictureId);
    if(pic && pic._childPicture){
        $StandingPictureManager.erase(pic._childPicture.standingImage());
    }
    Game_Screen_erasePicture.call(this,pictureId);
};
const Game_Screen_showPicture =Game_Screen.prototype.showPicture;

Game_Screen.prototype.showPicture =function(pictureId, name, origin, x, y,
    scaleX, scaleY, opacity, blendMode){
    Game_Screen_showPicture.apply(this,arguments);
    const stdImg = getStandingImage(name);
    if(stdImg){
        const picture = this.picture(pictureId);
        Picture_setStandingImage(picture,stdImg);
    }
};


const Game_Interpreter_pluginCommand=Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand =function(command, args){

    const len =command.length;
    const lastChar =command[len-1];
    if(lastChar !=='e'){
        Game_Interpreter_pluginCommand.call(this,command, args);
        return;        
    }

    const lowerCommand=command.toLowerCase();

    if(lowerCommand ==="setface"){
        const faceIndex = verOrNumber(args[1]);

        SetFace(args[0],faceIndex);
        return;
    }
    Game_Interpreter_pluginCommand.call(this,command, args);
};


class EditInfo {
    /**
     * @param {StandingImage} StandingImage 
     */
    constructor(standingImage){
        this.data = standingImage
        this.edited=false;
    }
};

class Window_FacePosition extends Window_Selectable{
    /**
     * @param {Sprite_Face} faceSprite 
     */
    initialize(faceSprite){
        const width=200;
        const x = Graphics.boxWidth -width;
        const y=0;
        super.initialize(x,y,width,this.fittingHeight(3));
        this.faceSprite= faceSprite
        this.hasChanged=false;
    }
    /**
     * @param {Bitmap} bitmap 
     */
    setBitmap(bitmap){
        this.bitmap =bitmap;
    }


    /**
     * @param {String} text 
     * @param {Rectangle} rect 
     */
    drawElement(text,rect){
        this.drawText(text,rect.x,rect.y,rect.width);
    }
    drawAllItems(){
        this.drawElement("X:"+this.faceSprite.x,this.itemRectForText(0));
        this.drawElement("Y:"+this.faceSprite.y,this.itemRectForText(1));
        this.drawElement("faceID:"+this.faceSprite.faceIndex,this.itemRectForText(2))
    }

    changeX(x){
        this.faceSprite.x +=x;
        this.refresh();
    }
    changeY(y){
        this.faceSprite.y +=y;
        this.refresh();
    }

    processCursorMove(){
        this.hasChanged =false;
        if (this.isOpenAndActive()) {
            const value = Input.isPressed('shift') ? 1 :10;

            if (Input.isRepeated('right')) {
                this.changeX(value);
            }
            if (Input.isRepeated('left')) {
                this.changeX(-value);
            }
            if (Input.isRepeated('up')) {
                this.changeY(-value);
            }
            if (Input.isRepeated('down')) {
                this.changeY(value);
            }
        }
    }
};

class Window_FaceSelect extends Window_Selectable{

    initialize(x,y){
        const height = this.fittingHeight(4);
        const width = 200;
        super.initialize(x,y,width,height);
    }

    /**
     * @param {Data_StandingImage} data
     */
    setData(data){
        this._data =data;
        this.refresh();
    }
    maxItems(){
        if(!this._data ){return 0;}
        return this._data.faceList.length;
    }
    drawAllItems(){
        if(this._data){
            super.drawAllItems();
        }
    }

    drawItem(index){
        const name =this._data.faceList[index];
        const rect = this.itemRect(index);
        this.drawText(name,rect.x,rect.y,rect.width);
    }


};

class Window_StandingImageSelect extends Window_Selectable{
    constructor(){
        super();
    }

    makeItemList_V2(){

    }
    initialize(x,y){
        if(setting.list){
            
            this._list = setting.list.createItemList();
        }else{
            console.log("list:"+setting.list);
            this._list =[];
        }

        const height = this.fittingHeight(this.maxPageRows());
        super.initialize(x,y,200,height);
    }

    
    maxPageRows(){
        return 8;
    }
    maxItems(){
        return (this._list.length);
    }

    select(index){
        const lastIndex= this._index;
        super.select(index);
        if(index !==lastIndex){
            this.callHandler("change");
        }
    }
    /**
     * @return {Data_StandingImage}
     * @param {Number} index 
     */
    item(index){
        return this._list[index];
    }
    /**
     * @return {EditInfo}
     */
    currnetItem(){
        return this.item( this._index);
    }
    /** 
     * @return {Game_StandingImage}
    */
    currnetData(){
        return this.currnetItem();//.data;
    }

    drawItem(index){
        const data = this.item(index);
        const rect = this.itemRectForText(index);
        this.drawText(data.standingImage,rect.x,rect.y,rect.width);
    }
}

class Scene_StandingImageEdit_V2 extends Scene_Base{
    create(){
        this.createStandingImageLayer();
        this.createWindowLayer();
        this.createAllWindow();
    }
    createStandingImageLayer(){
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        this._standingImage = new Sprite();
        this._standingImage.setFrame(x, y, width, height);
        this.addChild(this._standingImage);                
    }


    update(){
        super.update();
        this.updateFacePosition();
    }

    updateFacePosition(){
        if(this.facePositionWindow.hasChanged){
            this.imageSprite.face.x = this.facePositionWindow.faceX;
            this.imageSprite.face.y = this.facePositionWindow.faceY;
        }
    }
    cretateFacePositionWindow(){
        const window = new Window_FacePosition(this.imageSprite.face);
        window.setHandler('cancel',this.onFaceEditCancel.bind(this));
        window.setHandler("ok",this.onFaceEditOk.bind(this))
        window.setHandler("pageup",this.prevFace.bind(this));
        window.setHandler("pagedown",this.nextFace.bind(this));
        window.refresh();
        
        this.facePositionWindow=window;
        this.addWindow(window);
    }
    prevFace(){
        const faceIndex = this.imageSprite.face.faceIndex -1;
        if(faceIndex >=0 ){
            this.imageSprite.face.setFaceId(faceIndex);
        }else{
            this.imageSprite.face.setFaceId(faceIndex+8);
        }
        this.facePositionWindow.refresh();
        this.facePositionWindow.activate();
    }
    nextFace(){
        const faceIndex = this.imageSprite.face.faceIndex +1;
        this.imageSprite.face.setFaceId(faceIndex %8);

        this.facePositionWindow.refresh();
        this.facePositionWindow.activate();
    }

    /**
     * @param {Game_StandingImage} standingImage 
     */
    convertSaveText(standingImage){
        const result =[];
        for (const key in standingImage) {
            if (standingImage.hasOwnProperty(key)) {
                const element = object[key];
                result.push(makeKVP(element,key));
            }
        }
        return '{'+result.join(',')+'}';
    }
    setFacePos(x,y){
        this.imageSprite.face.x =x;
        this.imageSprite.face.y =y;
    }
    saveCurrentItem(){
        const data= this._standingImageSelectWindow.currnetItem();
        data.faceX = this.imageSprite.face.x;
        data.faceY = this.imageSprite.face.y;
    }

    createStandingImage(){
        const sprite = new Sprite_StandingImage();
        this.imageSprite= sprite;
        sprite.x = Graphics.boxWidth /2-150;
        this.addChild(sprite);
    }
    createStandingImageSelectWindow(){
        const window = new Window_StandingImageSelect(0,0);
        window.setHandler("cancel",this.popScene.bind(this));
        window.setHandler("change",this.onChangeImage.bind(this));
        window.setHandler("ok",this.onImageSalectOk.bind(this));

        this._standingImageSelectWindow=window;
        window.refresh();
        window.select(0);
        window.activate();
        this.addWindow(window);
    }

    createFaceNameWindow(){

    }
    createAllWindow(){
        this.createStandingImage( );
        this.cretateFacePositionWindow();
        this.createStandingImageSelectWindow();
    }
    terminate(){
        console.log("end");
        super.terminate();
    }

    onImageSalectOk(){
        this.facePositionWindow.activate();
    }

    onChangeImage(){
        const currnetItem = this._standingImageSelectWindow.currnetItem();
        if(!currnetItem){return;}
        this.imageSprite.setStandingImage(currnetItem);
        this.facePositionWindow.refresh();
    }

    onFaceEditOk(){
        const data = this._standingImageSelectWindow.currnetData();
        data.faceX = this.imageSprite.face.x;
        data.faceY = this.imageSprite.face.y;
        this.facePositionWindow.refresh();
        this._standingImageSelectWindow.activate();
    }

    onFaceEditCancel(){
        const data = this._standingImageSelectWindow.currnetData();
        this.imageSprite.face.x = data.faceX;
        this.imageSprite.face.y = data.faceY;
        this.facePositionWindow.refresh();
        this._standingImageSelectWindow.activate();
    }
};


/**
 * 
 * @param {Number} begin 
 * @param {Number} end 
 * @param {Number} t 
 */
function defaultLeapFunction(begin,end,t){
    return (begin +(t-1) +end) / t;
}


(function(){
    if(!setting.usingEditMode){
        return;
    }

    Scene_Title.prototype.commandStandingImageEdit=function(){
        SceneManager.push(Scene_StandingImageEdit_V2)
    };
    const Window_TitleCommand_makeCommandList=Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList =function(){
        Window_TitleCommand_makeCommandList.call(this);
        this.addCommand("立ち絵設定",setting.editModeSymbol,setting.list.size !==0);
    };
    const Scene_Title_createCommandWindow =Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow=function(){
        Scene_Title_createCommandWindow.call(this);
        this._commandWindow.setHandler(setting.editModeSymbol,this.commandStandingImageEdit.bind(this));
    };
})();

return {
    Picture:Game_ChildPicture_MA,
    Sprite_Image: Sprite_StandingImage,
    Sprite_Face:Sprite_Face
};

})();

