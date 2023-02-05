
const Header = props => {

  return <header className="container-fluid">
    <nav>
      <ul style={{width: 'var(--side-nav-width)'}}>
        <li><img alt="Risk Oracle logo" style={{height: '39px'}} src={`/pythia.svg`}/><strong style={{color: 'var(--contrast)'}}> Risk Oracle </strong></li>
      </ul>
      <ul  style={{width: '100%'}}>
        <li>          
          <input type="search" id="search" name="search" placeholder="Search Assets"/>
        </li>
      </ul>
      <ul>
      </ul>
    </nav>
  </header>
}

export default Header