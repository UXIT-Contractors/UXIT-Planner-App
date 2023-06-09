import { PrismaClient } from "@prisma/client"
import { Role } from "./role"
import { Weekday } from "./weekday"
import { CalendarDate, Time, toCalendarDateTime, getDayOfWeek, CalendarDateTime } from "@internationalized/date"

const prisma = new PrismaClient()

async function main() {
  //create user role
  const userRole = await prisma.role.create({
    data: {
      name: Role.USER,
      description: "Dit zijn de standaard gebruikers van de app."
    }
  })

  //create employee role
  const employeeRole = await prisma.role.create({
    data: {
      name: Role.EMPLOYEE,
      description: "Dit zijn de handmatig ingeroosterde medewerkers."
    }
  })

  //create admin role
  const adminRole = await prisma.role.create({
    data: {
      name: Role.ADMIN,
      description: "Admin rol houd alle rechten om de planner te beheren."
    }
  })

  //create retired role
  const retiredRole = await prisma.role.create({
    data: {
      name: Role.RETIRED,
      description: "Retired rol is voor gebruikers die niet meer actief zijn binnen pulchri en dus ook niet gebruik mogen maken van de planner."
    }
  })

  // Create Shift Types
  // weet niet of dit de bedoeling was maar heb een 3e shifttype toegevoegd voor als de vrijwilliger bij beide kan staan
  const shiftType1 = await prisma.shift_Type.create({
    data: {
      name: "Balie",
      description: "De vrijwilliger wil bij de balie zitten."
    }
  })

  const shiftType2 = await prisma.shift_Type.create({
    data: {
      name: "Galerie",
      description: "De vrijwilliger wil bij de galerie staan."
    }
  })

  // create admin user
  const adminUser = await prisma.user.create({
    data: {
      id: "clj13gfeh0004u1o1lt55cfuk",
      name: "Admin",
      last_name: "Admin",
      email: process.env.ADMIN_EMAIL,
      role: {
        connect: {
          name: Role.ADMIN
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
            }
          },
        }
      }
    }
  })


  const employeeUser1 = await prisma.user.create({
    data: {
      name: "Mede",
      last_name: "Werker",
      email: "exampleEmp@hotmail.com",
      role: {
        connect: {
          name: Role.EMPLOYEE
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const employeeUser2 = await prisma.user.create({
    data: {
      name: "Medew",
      last_name: "Erker",
      email: "exampleEmp2@hotmail.com",
      role: {
        connect: {
          name: Role.EMPLOYEE
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser1 = await prisma.user.create({
    data: {
      name: "Ronja",
      last_name: "van Boxtel",
      email: "example@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
        }
      }
    }
  })

  const staffing = await prisma.staffing.create({
    data: {
      shift: {
        create: {
          start: new Date("2023-06-23T18:00:00.000Z"),
          end: new Date("2023-06-23T23:00:00.000Z"),
        },
      },
      user: {
        connect: {
          id: adminUser.id
        },
      },
      shift_type: {
        connect: {
          id: shiftType1.id
        },
      },
    }
  })

  const backup = await prisma.backup.create({
    data: {
      date: new Date("2023-06-23T02:00:00.000Z"),
      user: {
        connect: {
          id: adminUser.id
        },
      },
    }
  })


  const mockUser2 = await prisma.user.create({
    data: {
      name: "Willem",
      last_name: "Bekker",
      email: "example2@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })



  const mockUser3 = await prisma.user.create({
    data: {
      name: "Ellen",
      last_name: "Coster",
      email: "example3@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser4 = await prisma.user.create({
    data: {
      name: "Wilbert",
      last_name: "van Dijk",
      email: "example4@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser5 = await prisma.user.create({
    data: {
      name: "Willem",
      last_name: "Donkers",
      email: "example5@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser6 = await prisma.user.create({
    data: {
      name: "Mariëtte",
      last_name: "Groen",
      email: "example6@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser7 = await prisma.user.create({
    data: {
      name: "Ellen",
      last_name: "de Jongh",
      email: "example7@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser8 = await prisma.user.create({
    data: {
      name: "Linda",
      last_name: "Liem",
      email: "example8@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser9 = await prisma.user.create({
    data: {
      name: "Marijke",
      last_name: "Rodermond",
      email: "example9@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser10 = await prisma.user.create({
    data: {
      name: "Angelique",
      last_name: "Schröter",
      email: "example10@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser11 = await prisma.user.create({
    data: {
      name: "Ingrid",
      last_name: "Vossenaar",
      email: "example11@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser12 = await prisma.user.create({
    data: {
      name: "Hennie",
      last_name: "Vosters",
      email: "example12@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser13 = await prisma.user.create({
    data: {
      name: "Anja",
      last_name: "de Vries",
      email: "example13@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser14 = await prisma.user.create({
    data: {
      name: "Debbie",
      last_name: "Coninck Westenberg",
      email: "example14@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser15 = await prisma.user.create({
    data: {
      name: "Frits",
      last_name: "van der Zweep",
      email: "example15@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser16 = await prisma.user.create({
    data: {
      name: "Jacobine",
      last_name: "van Nieuwkuijk",
      email: "example16@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser17 = await prisma.user.create({
    data: {
      name: "Janine",
      last_name: "Ossewaarde",
      email: "example17@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  })

  const mockUser18 = await prisma.user.create({
    data: {
      name: "Mirjam",
      last_name: "Alexi",
      email: "example18@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  const mockUser19 = await prisma.user.create({
    data: {
      name: "Fenna",
      last_name: "Heezen",
      email: "example19@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  const mockUser20 = await prisma.user.create({
    data: {
      name: "Linda",
      last_name: "van der Touw",
      email: "example20@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  const mockUser21 = await prisma.user.create({
    data: {
      name: "Marcella",
      last_name: "van de Mortel",
      email: "example21@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  const mockUser22 = await prisma.user.create({
    data: {
      name: "Danielle",
      last_name: "Proper",
      email: "example22@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  const mockUser23 = await prisma.user.create({
    data: {
      name: "Marcella",
      last_name: "Zietse",
      email: "example23@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  const mockUser24 = await prisma.user.create({
    data: {
      name: "Paula",
      last_name: "Knotter",
      email: "example24@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  const mockUser25 = await prisma.user.create({
    data: {
      name: "Sally Ann",
      last_name: "Hartmann",
      email: "example25@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  const mockUser26 = await prisma.user.create({
    data: {
      name: "Ingrid",
      last_name: "Zichem",
      email: "example26@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_odd_week: {
            create: {
              availability: {
                create: []
              }
            }
          },
          availability_flexible: {
            create: {
              availability: {
                create: []
              }
            }
          }
        }
      }
    }
  })

  let startDate = new CalendarDate(2023, 1, 1)
  const endDate = new CalendarDate(2024, 1, 1)

  while (startDate.compare(endDate) < 0) {

    if (getDayOfWeek(startDate, 'en-US') === Weekday.MONDAY) {
      startDate = startDate.add({ days: 1 })
      continue
    }
    const firstShiftDateTime = toCalendarDateTime(startDate, new Time(11, 45))
    const secondShiftDateTime = toCalendarDateTime(startDate, new Time(14, 0))
    const endFirstShiftDateTime = toCalendarDateTime(startDate, new Time(15, 0))
    const endSecondShiftDateTime = toCalendarDateTime(startDate, new Time(17, 15))

    if (getDayOfWeek(startDate, 'en-US') === Weekday.SATURDAY || getDayOfWeek(startDate, 'en-US') === Weekday.SUNDAY) {
      await prisma.shift.create({
        data: {
          start: firstShiftDateTime.toDate('Europe/Amsterdam'),
          end: endSecondShiftDateTime.toDate('Europe/Amsterdam'),
          staff_required: {
            create: {
              amount: 2,
              shift_type: { connect: { id: shiftType1.id } }
            }
          }
        },
      })
      startDate = startDate.add({ days: 1 })
      continue
    }

    await prisma.shift.create({
      data: {
        start: firstShiftDateTime.toDate('Europe/Amsterdam'),
        end: endFirstShiftDateTime.toDate('Europe/Amsterdam'),
        staff_required: {
          create: {
            amount: 1,
            shift_type: { connect: { id: shiftType1.id } }
          }
        }
      },
    })

    const shift2 = await prisma.shift.create({
      data: {
        start: secondShiftDateTime.toDate('Europe/Amsterdam'),
        end: endSecondShiftDateTime.toDate('Europe/Amsterdam'),
        staff_required: {
          create: {
            amount: 1,
            shift_type: { connect: { id: shiftType1.id } }
          }
        }
      },
    })

    startDate = startDate.add({ days: 1 })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
      .catch(() => { console.error("Something went wrong") })
  })
