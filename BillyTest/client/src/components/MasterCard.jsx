import { useEffect, useRef, useState } from 'react';
import InfoCardTemplate from './InfoCardTemplate';

const MasterCard = ({ bill, user, onFavoritesUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(undefined);
  const [favorites, setFavorites] = useState(user?.following || []);
  const ref = useRef(null);

  const handleOpening = () => setIsOpen(prev => !prev);

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const observerTarget = ref.current;
    const resizeObserver = new ResizeObserver(e => {
      setHeight(e[0].contentRect.height);
    });
    resizeObserver.observe(observerTarget);

    return () => resizeObserver.unobserve(observerTarget);
  }, [height, isOpen]);

  useEffect(() => {
    setHeight(isOpen ? ref.current.getBoundingClientRect().height : 0);
  }, [isOpen]);

  const toggleFavorite = async (billId) => {
    if (!user || !user._id) {
      console.error("User is not defined.");
      return;
    }

    const isAlreadyFavorited = favorites.includes(billId);

    try {
      const response = await fetch(`http://localhost:3000/api/user/following`, {
        method: isAlreadyFavorited ? 'DELETE' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user._id, bill_id: billId })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      setFavorites(prev =>
        isAlreadyFavorited
          ? prev.filter(id => id !== billId)
          : [...prev, billId]
      );

      if (typeof onFavoritesUpdated === 'function') {
        onFavoritesUpdated();
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  if (!bill || !Array.isArray(bill)) {
    console.warn("⛔ MasterCard received invalid bill prop:", bill);
    return <p>No bill data available.</p>;
  }

  return (
    <div>
      {bill.map((item) => (
        <div className='card' key={item._id}>
          <section>
            <header className='pt-serif-regular card-content-height' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1>{item.bill_id}</h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* ✅ Favorite button in collapsed card header */}
                <button
                  onClick={() => toggleFavorite(item._id)}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '1.5rem',
                    color: favorites.includes(item._id) ? 'gold' : 'gray',
                    cursor: 'pointer'
                  }}
                  title={favorites.includes(item._id) ? 'Unfavorite' : 'Favorite'}
                >
                  {favorites.includes(item._id) ? '★' : '☆'}
                </button>

                <button
                  onClick={handleOpening}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontWeight: '1000',
                    color: '#886a4d'
                  }}
                >
                  {isOpen ? '⬆︎' : '⬇︎'}
                </button>
              </div>
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
                      userFavorites={favorites}
                      onFavoritesUpdated={onFavoritesUpdated}
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