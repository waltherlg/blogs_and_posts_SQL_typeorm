const sortByFixer = (sortBy) => {
    const sortByUp = sortBy.toUpperCase()
    return (sortByUp === 'ASC' || sortByUp === 'DESC') ? sortByUp : 'ASC'
  }