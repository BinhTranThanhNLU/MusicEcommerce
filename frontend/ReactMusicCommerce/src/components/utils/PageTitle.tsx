interface PageTitleProps {
  title?: string;
  current?: string;
}

const PageTitle = ({
  title = "Danh sách sản phẩm",
  current = "Danh sách sản phẩm",
}: PageTitleProps) => {
  return (
    <div className="page-title light-background">
      <div className="container d-lg-flex justify-content-between align-items-center">
        <h1 className="mb-2 mb-lg-0">{title}</h1>
        <nav className="breadcrumbs">
          <ol>
            <li>
              <a href="../../index.html">Trang chủ</a>
            </li>
            <li className="current">{current}</li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default PageTitle;
