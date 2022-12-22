import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  const isLoggedIn = useSelector((state) => !!state.auth.id);

  return isLoggedIn ? (
    <Link to={{ pathname: 'https://lucasmcgill.nyc' }} target="_blank">
      <div id="footer">
        <h3>
          <i>Billfold</i>, by Lucas McGill
        </h3>
      </div>
    </Link>
  ) : (
    ''
  );
}
