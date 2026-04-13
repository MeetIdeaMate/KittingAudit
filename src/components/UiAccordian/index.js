import { useRef } from 'react';
import classNames from 'classnames';
import './style.scss';
import { DownArrow } from '../../assets/images';

const UiAccordian = ({ children, ...props }) => {
    const contentEl = useRef();
    const { handleToggle, active, data, noborder, balanceQty } = props;
    const { label, id } = data;
    
    return (
        <div style={{backgroundColor: balanceQty === 0 ? "#d8f7c9" : ( active === id ? "#FFF3EB" : "" )}} className={classNames({ 'accordion__card': true, 'no-border': noborder })}>
            <div className="accordion__header">
                <div className={`accordion__toggle ${active === id ? 'active' : ''}`} onClick={() => handleToggle(id)}>
                    <div style={{ padding: 0, margin: 0 }}>
                        <h3 style={{ padding: 0, margin: 0 }}>{label}</h3>
                    </div>
                    <img src={DownArrow} alt="Arrow" style={{
                        transition: "transform 0.3s ease",
                        transform: active === id ? "rotate(180deg)" : "rotate(0deg)",
                    }} />
                </div>
            </div>
            <div ref={contentEl} className={`accordion__collapse ${active === id ? 'show' : ''}`} style={
                active === id
                    ? { height: contentEl?.current?.scrollHeight }
                    : { height: "0px" }
            }>
                <div className="accordion__body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default UiAccordian;