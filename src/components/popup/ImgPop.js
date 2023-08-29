import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { enum_api_uri } from "../../config/enum";
import { imgPop, imgListPop } from "../../store/popupSlice";
import sampleImg from "../../images/sample/img_sample.jpg";
import { Navigation } from "swiper";

const ImgPop = (props) => {
    const location = useLocation();
    const popup = useSelector((state)=>state.popup);
    const dispatch = useDispatch();
    const swiperRef = useRef(null);
    const [slideOnIdx, setSlideOnIdx] = useState(null);
    const [bigImg, setBigImg] = useState("");
    const [admin, setAdmin] = useState(false);

    //팝업닫기
    const closePopHandler = () => {
        dispatch(imgPop({imgPop:false,imgPopList:[],imgPopIdx:null}));
    };

    //썸네일 슬라이더
    const swiperOptions = {
        slidesPerView:3,
        spaceBetween:8,
    };

    //썸네일 슬라이드 클릭시 on
    const goToSlide = (index) => {
        if (swiperRef.current && swiperRef.current.swiper) {
            setSlideOnIdx(index);
            swiperRef.current.swiper.slideTo(index);
        }
    };

    //다음버튼 클릭시
    const nextHandler = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            console.log(slideOnIdx)
            setSlideOnIdx(slideOnIdx + 1);
            swiperRef.current.swiper.slideTo(slideOnIdx + 1);
        }
    };

    //이전버튼 클릭시
    const prevHandler = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            setSlideOnIdx(slideOnIdx - 1);
            swiperRef.current.swiper.slideTo(slideOnIdx - 1);
        }
    };

    //맨처음 큰이미지, 썸네일 슬라이드on 
    useEffect(()=>{
        setBigImg(popup.imgPopList[popup.imgPopIdx]);
        setSlideOnIdx(popup.imgPopIdx);
        swiperRef.current.swiper.slideTo(popup.imgPopIdx,1);
    },[]);

    //썸네일 슬라이드on 변경될때마다 큰이미지 src 변경
    useEffect(()=>{
        setBigImg(popup.imgPopList[slideOnIdx]);
    },[slideOnIdx]);


    //연결한대화방 페이지일때는 admin true
    useEffect(()=>{
        const path = location.pathname;
        if(path == "/chat"){
            setAdmin(true);
        }
    },[location.pathname]);


    //키보드 화살표 좌우 클릭시 슬라이드변경
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [slideOnIdx]);


    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            if(slideOnIdx + 1 < popup.imgPopList.length){
                nextHandler();
            }
        } else if (event.key === 'ArrowLeft') {
            if (slideOnIdx > 0) {
                prevHandler();
            }
        }
    };


    return(
        <div className="pop_wrap img_pop">
            <div className="dim"></div>
            <div className="pop_cont">
                <div className="inner">
                    <div className="pop_tit flex_between">
                        <p className="f_24"><strong>사진 모아보기</strong></p>
                        <button type="button" className="btn_close" onClick={closePopHandler}>닫기버튼</button>
                    </div>
                    <div className="img_cont">
                        <div className="box">
                            <div className="img">
                                <img src={bigImg} alt="이미지" />
                            </div>
                            <Swiper ref={swiperRef} className={`thumb_slider ${popup.imgPopList.length < 4 ? "center_slider" : ""}`} {...swiperOptions} >
                                {popup.imgPopList.map((img,i)=>{
                                    return(
                                        <SwiperSlide key={i} 
                                            onClick={()=>{
                                                goToSlide(i);
                                                setBigImg(img);
                                            }} 
                                            className={slideOnIdx === i ? "on" : ""}
                                        >
                                            <img src={img} alt="이미지" />
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                            {slideOnIdx + 1 < popup.imgPopList.length &&
                                <button type="button" className="btn_next" onClick={nextHandler}>다음버튼</button>
                            }
                            {slideOnIdx > 0 &&
                                <button type="button" className="btn_prev" onClick={prevHandler}>이전버튼</button>
                            }
                        </div>
                        <button type="button" className="btn_list" onClick={()=>{
                            closePopHandler();
                            dispatch(imgListPop({imgListPop:true,imgListPopAdmin:admin}));
                        }}>사진 목록 보기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImgPop;