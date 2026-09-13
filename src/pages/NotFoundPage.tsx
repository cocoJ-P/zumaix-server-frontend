import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">页面不存在</h1>
      <p className="not-found__description">当前地址没有对应的工作台页面。</p>
      <Link to="/" className="btn">
        返回总览
      </Link>
    </div>
  );
}
