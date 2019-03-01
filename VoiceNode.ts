// 声音按钮
import { Net } from "./Net";
import { G } from "./G";
import { V } from "./V";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VoiceNode extends cc.Component {
    @property(cc.Node)
    micVoice: cc.Node = null;
    @property(cc.Node)
    vbgSprite: cc.Node = null;
    @property(cc.Node)
    showvSprite: cc.Node = null;
    @property(cc.Node)
    canclevSprite: cc.Node = null;
    @property(cc.Node)
    shotvSprite: cc.Node = null;
    
    public iTouchId = 0;
    public starTouchTime = 0;
    public posOrigin = null;
    public posEnd = null;
    public voiceNative = null;
    onLoad () {
        var self = this;
        this.voiceNative = this.node.getComponent('VoiceNative');
        this.micVoice.on('touchstart', function(event){
            if(self.iTouchId != 0){
                return;
            }
            self.iTouchId = event.getID();            
            self.posOrigin = event.getLocation();
            self.starTouchTime = G.getMms();

            self.vbgSprite.active = true;
            self.showvSprite.active = true;
            self.canclevSprite.active = false;
            self.shotvSprite.active = false;
            
            self.voiceNative.prepare("record.amr");
        })
        this.micVoice.on('touchmove', function(event){
            if(self.iTouchId != event.getID()){
                return;
            }
            let mpos = event.getLocation();
            if( (mpos.y - self.posOrigin.y) > 10){
                self.vbgSprite.active = true;
                self.showvSprite.active = false;
                self.canclevSprite.active = true;
                self.shotvSprite.active = false;
            }else{
                self.vbgSprite.active = true;
                self.showvSprite.active = true;
                self.canclevSprite.active = false;
                self.shotvSprite.active = false;
            }
        })
        this.micVoice.on('touchend', function(event){
            if(self.iTouchId != event.getID()){
                return;
            }
            self.iTouchId = 0;
            self.posEnd = event.getLocation();
            self.endVoiceTouch();
        })
        this.micVoice.on('touchcancel', function(event){
            if(self.iTouchId != event.getID()){
                return;
            }
            self.iTouchId = 0;
            self.posEnd = event.getLocation();
            self.endVoiceTouch();
        })
    }

    endVoiceTouch(){
        var self = this;
        self.vbgSprite.active = false;
        self.showvSprite.active = false;
        self.canclevSprite.active = false;
        self.shotvSprite.active = false;

        if(this.posEnd.y - this.posOrigin.y > 10){
            // 取消发送
            self.voiceNative.cancel();
        }else{
            // 录音结束
            self.voiceNative.release();
            // 读取录音文件
            var msgStr = self.voiceNative.getVoiceData("record.amr");
            console.log('---voice:' + msgStr);

            // 本地测试测试
            setTimeout(function () {
                // 间隔两秒播放录音
                var msgfile = "record.amr";
                console.log('---voice: play' + msgfile);

                // 到这里结束
                //voiceNative.writeVoice 根据msgStr 文件  和命名 把后端发送过来的语音存放本地
                // 本地测试不需要这步
                self.voiceNative.writeVoice(msgfile, msgStr);
                cc.log("即将要播放的语音内容" + msgStr);
                self.showSpeaker(msgfile);
                                     
            }, 2000)
        }
    }

    showSpeaker(msgfile) {
        this.voiceNative.play(msgfile);
    }

    start () {

    }

    // update (dt) {}
}
