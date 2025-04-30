import { useEffect, useRef, useState } from 'react';
import InfoCardTemplate from './InfoCardTemplate';

const MasterCard = ({ bill, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(undefined);
  const ref = useRef(null);

  const handleOpening = () => setIsOpen(prev => !prev);

  useEffect(() => {
    if (!isOpen) return;
    const resizeObserver = new ResizeObserver(e => {
      setHeight(e[0].contentRect.height);
    });
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, [height, isOpen]);

  useEffect(() => {
    setHeight(isOpen ? ref.current.getBoundingClientRect().height : 0)
  }, [isOpen]);

  if (!bill || !Array.isArray(bill)) {
    console.warn("⛔ MasterCard received invalid bill prop:", bill);
    return <p>No bill data available.</p>;
  }

  const userFavorites = user?.following || [];

  return (
    <div>
      {bill.map((item) => (
        <div className='card' key={item._id}>
          <section>
            <header className='pt-serif-regular card-content-height'>
              <div></div>
              <span style={{ color: '#bd6034', fontStyle: 'italic' }}></span>
              <h1>{item.bill_id}</h1>

              <button
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontWeight: '1000',
                  color: '#886a4d'
                }}
                onClick={handleOpening}>
                {isOpen ? "⬆︎" : "⬇︎"}
              </button>

              <button className='fave-button'>
                ✶
              </button>
            </header>

            <section className='card-content-height' style={{ height }}>
              <div ref={ref}>
                <div className='roboto-main'>
                  {item.bill_summary}
                </div>

                <section style={{ display: 'block' }}>
                  <div className='container grid'>
                    <InfoCardTemplate
                      bill={[item]}
                      user={user}
                      userFavorites={userFavorites}
                    />
                  </div>
                </section>
              </div>
            </section>
          </section>
        </div>
      ))}
    </div>
  );
};

export default MasterCard;

