;
//--------------------------------------------------------------------------//
//다이렉트샵슬라이더(HOVER_IMAGE_CHANGE), 박경호, 2022-02-03//
//--------------------------------------------------------------------------//

class Daslider {

    constructor(option) {
        if ( !option?.targetID) {
            console.error("targeID가 없으면 슬라이드 바인딩이 불가능합니다.");
            return;
        } else {

            //[정보] 슬라이더의 아이디
            this.targetID = option.targetID;

            //[정보] 앵커 클래스명
            this.anchorClassName = (option.anchorClassName === undefined) || (option.anchorClassName === '') ? 'daslider_anchor' : option.anchorClassName ;

            //[정보] 슬라이더 버튼의 선택자
            this.buttonSelector = {
                prev: (option.prevClassName === undefined) || (option.prevClassName === '') ? '.daslider_button_prev' : option.buttonSelectorPrev,
                next: (option.nextClassName === undefined) || (option.nextClassName === '') ? '.daslider_button_next' : option.buttonSelectorNext
            };

            //[정보] 슬라이드 
            this.slideInfo = {
                totalCount: document.querySelectorAll('.daslider_background_image').length,
                nowIndex: 0
            };

            //[정보] 노드
            this.nodeInfo = {
                prevButton : document.querySelectorAll(`#${this.targetID} ${this.buttonSelector.prev}`)[0],
                nextButton : document.querySelectorAll(`#${this.targetID} ${this.buttonSelector.next}`)[0],
                anchors : document.querySelectorAll(`.${this.anchorClassName}`)
            };
            
            //[플래그] 멈춤여부
            this.isStop = false;

            //[정보] 전환 속도
            this.speed = (option.speed === undefined) || (option.speed === '') || (option.speed < 0) ? 1500 : option.speed;

            // [이벤트 위임] 이전 슬라이드 모션
            this.nodeInfo.prevButton.addEventListener("click", () => {
                this.functions.prevMotion();
            });
            
            //[이벤트 위임] 다음 슬라이드 모션
            this.nodeInfo.nextButton.addEventListener("click", () => {
                this.functions.nextMotion();
            });
            
            //[이벤트 위임] 슬라이드 일시정지
            for (let i=0 ; i < this.nodeInfo.anchors.length ; i++ ) {
                let element = this.nodeInfo.anchors[i];
                element.addEventListener('mouseover', () => {
                    let nodes = Array.prototype.slice.call( document.querySelectorAll(`#${this.targetID} .daslider_anchor_ul`)[0].children );
                    let indexOfLi = nodes.indexOf(element.parentNode);
                    this.functions.clearBackgroundActive();
                    document.getElementsByClassName('daslider_background_image')[indexOfLi].classList.add('active');
                    this.isStop = true;
                });
                element.addEventListener('mouseout', () => {
                    this.isStop = false;
                });
            };
            
            //[함수 모음]
            this.functions ={

                //[클래스 초기화] 이미지
                clearBackgroundActive : () => {
                    document.querySelectorAll(`#${this.targetID} .daslider_background_image`).forEach(el => {
                        el.classList.remove('active');
                    });
                },
                
                //[클래스 초기화] 앵커
                clearAnchorActive : () => {
                    document.querySelectorAll(`#${this.targetID} .${this.anchorClassName}`).forEach(el => {
                        el.classList.remove('active');
                    });
                },

                //[모션] 이전 슬라이드
                prevMotion : () => {
                    if ( this.slideInfo.nowIndex <= 0 ) {
                        this.slideInfo.nowIndex = this.slideInfo.totalCount;
                    };
                    this.functions.clearBackgroundActive();
                    this.functions.clearAnchorActive();
                    document.querySelectorAll(`#${this.targetID} .daslider_background_image`)[this.slideInfo.nowIndex - 1].classList.add("active");
                    document.querySelectorAll(`#${this.targetID} .${this.anchorClassName}`)[this.slideInfo.nowIndex - 1].classList.add("active");
                    this.slideInfo.nowIndex--;
                },
                
                //[모션] 다음 슬라이드
                nextMotion : () => {
                    if ( this.slideInfo.nowIndex === this.slideInfo.totalCount - 1 ) {
                        this.slideInfo.nowIndex = -1;
                    };
                    this.functions.clearBackgroundActive();
                    this.functions.clearAnchorActive();
                    document.querySelectorAll(`#${this.targetID} .daslider_background_image`)[this.slideInfo.nowIndex + 1].classList.add("active");
                    document.querySelectorAll(`#${this.targetID} .${this.anchorClassName}`)[this.slideInfo.nowIndex + 1].classList.add("active");
                    this.slideInfo.nowIndex++;
                }

            };

        };
        
    };

};

//[함수] 옵션을 받아서 동적으로 인스턴스를 생성
const initDaslider = (options) => {

    window[options.targetID] = new Daslider({
        targetID: options.targetID,
        speed: options.speed,
        anchorClassName: options.anchorClassName,
        buttonSelectorPrev: options.buttonSelectorPrev,
        buttonSelectorNext: options.buttonSelectorNext
    });
    
    const ActivatingSlider = () => {
        setInterval( ()=>{
            if ( !window[options.targetID]?.isStop ) {
                window[options.targetID]?.functions.nextMotion();
            };
        } , window[options.targetID]?.speed);
    };
    
    //슬라이더 움직임 실행
    ActivatingSlider();
};