import React, { useRef, useEffect, useState } from 'react';
import BookCard from './BookCard';

const AvailableNow = ({ books, onBookClick }) => {
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Limit to 10 books for display
    const displayBooks = books.slice(0, 10);

    // Manual scroll handlers
    const handleScroll = (direction) => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const scrollAmount = 350; // Scroll by ~2 books (167px * 2 + gaps)

        if (direction === 'left') {
            scrollContainer.scrollTo({
                left: scrollContainer.scrollLeft - scrollAmount,
                behavior: 'smooth'
            });
        } else {
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            const newScroll = scrollContainer.scrollLeft + scrollAmount;

            if (newScroll >= maxScroll) {
                // Reset to start if reaching end
                scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollContainer.scrollTo({
                    left: newScroll,
                    behavior: 'smooth'
                });
            }
        }
    };

    // Auto scroll carousel (pause when hovering) - Use same logic as manual
    useEffect(() => {
        if (isHovered) return;

        const autoScroll = setInterval(() => {
            handleScroll('right'); // Scroll right automatically
        }, 3000); // Every 3 seconds

        return () => clearInterval(autoScroll);
    }, [isHovered]);

    return (
        <div
            className="w-[705px] h-[200px] flex rounded-2xl overflow-hidden shadow-md flex-shrink-0 relative group z-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Vertical "Available now" Tab */}
            <div className="
                bg-gradient-to-r from-[#A5B6CE] to-[#576D91]
                w-[60px]
                flex
                items-center
                justify-center
                flex-shrink-0
            ">
                <p className="
                    text-white
                    tracking-wide
                    transform
                    -rotate-90
                    whitespace-nowrap
                    text-xl
                    font-inter
                ">
                    Available now
                </p>
            </div>

            {/* Scrollable Books */}
            <div
                ref={scrollRef}
                className="
                    flex-1
                    bg-white
                    overflow-x-auto
                    overflow-y-hidden
                    px-6
                    py-6
                    flex
                    items-center
                    gap-4
                "
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {displayBooks.map(book => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onClick={onBookClick}
                        variant="carousel"
                    />
                ))}
                {/* Duplicate first 3 books for seamless loop */}
                {displayBooks.slice(0, 3).map((book, index) => (
                    <BookCard
                        key={`duplicate-${book.id}-${index}`}
                        book={book}
                        onClick={onBookClick}
                        variant="carousel"
                    />
                ))}
            </div>

            {/* Navigation Buttons - Show on hover */}
            <div className="
                absolute
                top-1/2
                -translate-y-1/2
                left-[80px]
                right-6
                flex
                justify-between
                pointer-events-none
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-300
            ">
                {/* Previous Button */}
                <button
                    onClick={() => handleScroll('left')}
                    className="
                        pointer-events-auto
                        w-10
                        h-10
                        rounded-full
                        bg-white/90
                        hover:bg-white
                        shadow-lg
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-200
                        hover:scale-110
                        cursor-pointer
                    "
                    aria-label="Previous"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M12.5 15L7.5 10L12.5 5" stroke="#4D4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Next Button */}
                <button
                    onClick={() => handleScroll('right')}
                    className="
                        pointer-events-auto
                        w-10
                        h-10
                        rounded-full
                        bg-white/90
                        hover:bg-white
                        shadow-lg
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-200
                        hover:scale-110
                        cursor-pointer
                    "
                    aria-label="Next"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#4D4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AvailableNow;
