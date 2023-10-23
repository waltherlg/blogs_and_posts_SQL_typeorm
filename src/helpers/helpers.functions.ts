export const sortDirectionFixer = (sortDirection) => {
    const sortDirUp = sortDirection.toUpperCase()
    return (sortDirUp === 'ASC' || sortDirUp === 'DESC') ? sortDirUp : 'DESC'
  }