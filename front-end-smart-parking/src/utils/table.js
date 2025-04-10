export const showTotal = (total, range) => {
  return (
    <div className="page-detail-table">
      {range[0]} - {range[1]} / {total} bản ghi
    </div>
  )
}
          