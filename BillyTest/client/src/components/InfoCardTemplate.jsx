import { useEffect, useRef, useState } from 'react';

const InfoCardTemplate = ({ bill, user, userFavorites, onFavoritesUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(undefined);
  const [favorites, setFavorites] = useState(userFavorites || []);
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

      // Trigger re-fetch if available
      if (typeof onFavoritesUpdated === 'function') {
        onFavoritesUpdated();
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  if (!Array.isArray(bill)) return null;

  return (
    <div>
      {bill.map((item) => (
        <div className='card-content-width' key={item._id}>
          <section>
            {/* Header: always visible */}
            <header
              className='pt-serif-title-info'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1>Bill Actions</h1>
              </div>

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
            </header>

            {/* Expandable Section */}
            <section className="card-content-height" style={{ height }}>
              <div ref={ref}>
                <div className='roboto-info card-content-height'>
                  {item.bill_actions?.length > 0 ? (
                    item.bill_actions.map((action, index) => (
                      <p key={index}>
                        {action.action_date?.slice(0, 10)} – {action.action_description}
                      </p>
                    ))
                  ) : (
                    <p>No actions recorded for this bill.</p>
                  )}
                </div>
              </div>
            </section>
          </section>
        </div>
      ))}
    </div>
  );
};

export default InfoCardTemplate;

