export const SANDBOX_QUERY = `query BusinessCard {
  profile {
    name
    headline
    description
    location
    links {
      label
      url
    }
    skills {
      name
      category
      level
    }
    experience {
      company
      position
      period {
        start
        end
        isCurrent
        months
      }
      achievements
      projects {
        name
      }
    }
    projects {
      name
      description
      url
      stack {
        name
      }
    }
  }
}
`;
