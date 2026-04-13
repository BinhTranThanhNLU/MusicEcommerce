const Pagination = () => {
  return (
    <section id="category-pagination" className="category-pagination section">
      <div className="container">
        <nav
          className="d-flex justify-content-center"
          aria-label="Page navigation"
        >
          <ul>
            <li>
              <a href="#" aria-label="Previous page">
                <i className="bi bi-arrow-left"></i>
                <span className="d-none d-sm-inline">Previous</span>
              </a>
            </li>

            <li>
              <a href="#" className="active">
                1
              </a>
            </li>
            <li>
              <a href="#">2</a>
            </li>
            <li>
              <a href="#">3</a>
            </li>
            <li className="ellipsis">...</li>
            <li>
              <a href="#">8</a>
            </li>
            <li>
              <a href="#">9</a>
            </li>
            <li>
              <a href="#">10</a>
            </li>

            <li>
              <a href="#" aria-label="Next page">
                <span className="d-none d-sm-inline">Next</span>
                <i className="bi bi-arrow-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default Pagination;
