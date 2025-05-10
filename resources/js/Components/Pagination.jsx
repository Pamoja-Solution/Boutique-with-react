import { Link } from '@inertiajs/react';

export default function Pagination({ links, className = '' }) {
    if (links.length <= 3) return null;

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <nav className="join">
                {/* Previous Page Link */}
                <Link
                    href={links[0].url || '#'}
                    className={`join-item btn btn-sm ${!links[0].url ? 'btn-disabled' : ''}`}
                >
                    &laquo;
                </Link>

                {/* Page Links */}
                {links.slice(1, -1).map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        className={`join-item btn btn-sm ${link.active ? 'btn-active' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}

                {/* Next Page Link */}
                <Link
                    href={links[links.length - 1].url || '#'}
                    className={`join-item btn btn-sm ${!links[links.length - 1].url ? 'btn-disabled' : ''}`}
                >
                    &raquo;
                </Link>
            </nav>
        </div>
    );
}