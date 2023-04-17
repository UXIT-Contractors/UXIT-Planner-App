import { PrismaClient } from "@prisma/client";
import cuid from "cuid";

const prisma = new PrismaClient();

async function main() {
  // Create Shift Types
  // weet niet of dit de bedoeling was maar heb een 3e shifttype toegevoegd voor als de vrijwilliger bij beide kan staan
  const shiftType1 = await prisma.shift_Type.create({
    data: {
      name: "Balie",
      description: "De vrijwilliger wil bij de balie zitten."
    }
  });

  const shiftType2 = await prisma.shift_Type.create({
    data: {
      name: "Galerie",
      description: "De vrijwilliger wil bij de galerie staan."
    }
  });

  console.log("Shift Types created: ", shiftType1, shiftType2);

  // mockdata voor gebruikers, voorkeuren en standaard beschikbaarheid
  // user 1: robert swarts, elke dag, max 2x
  // user 2, lars baer, dinsdag/woensdag, max 2x
  // user 3, manuel vermeer, donderdag/vrijdag, max 2x
  // user 4, david sprong, zaterdag, max 1x
  // user 5, olivier verbeten, zondag, max 1x
  // user 6, emma beil, elke dag, max 4x
  // user 7, barbara damme, woensdag/zaterdag/zondag, max 1x
  // user 8, isabella host, dinsdag/woensdag, max 2x
  // user 9, marieke burckhard, donerdag/vrijdag/zaterdag, max 2x
  // user 10, maria nellessen, vrijdag/zaterdag/zondag, max 3x
  const users = [];

  // user 1
  let availabilityId: string;
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Robert",
        last_name: "Swarts",
        email: "robertswarts@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 2,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  }
                },
                {
                  weekday: 3,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 4,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 5,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 6,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 7,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                }
              ]
            }
          }
        }
      }
    })
  );

  // user 2
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Lars",
        last_name: "Baer",
        email: "larsbaer@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 2,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  }
                },
                {
                  weekday: 3,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                }
              ]
            }
          }
        }
      }
    })
  );

  // user 3
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Manuel",
        last_name: "Vermeer",
        email: "manuelvermeer@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 4,
                  shift_types: {
                    connect: [{
                      id: shiftType1.id
                    },
                    {
                      id: shiftType2.id
                    }]
                  }
                },
                {
                  weekday: 5,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                }
              ]
            }
          }
        }
      }
    })
  );

  // user 4
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "David",
        last_name: "Sprong",
        email: "davidsprong@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 1,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 6,
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
    })
  );

  // user 5
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Olivier",
        last_name: "Verbeten",
        email: "olivierverbeten@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 1,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 7,
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
    })
  );

  // user 6
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Emma",
        last_name: "Beil",
        email: "emmabeil@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 4,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 2,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  }
                },
                {
                  weekday: 3,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 4,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 5,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 6,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 7,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                }
              ]
            }
          }
        }
      }
    })
  );

  // user 7
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Barbara",
        last_name: "Damme",
        email: "barbaradamme@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 1,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 3,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  }
                },
                {
                  weekday: 6,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 7,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                }
              ]
            }
          }
        }
      }
    })
  );

  // user 8
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Isabella",
        last_name: "Host",
        email: "isabellahost@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 2,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  }
                },
                {
                  weekday: 3,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                }
              ]
            }
          }
        }
      }
    })
  );

  // user 9
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Marieke",
        last_name: "Burckhard",
        email: "mariekeburckhard@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 4,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  }
                },
                {
                  weekday: 5,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  weekday: 6,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                }
              ]
            }
          }
        }
      }
    })
  );

  // user 10
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Maria",
        last_name: "Nellessen",
        email: "marianellessen@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 3,
            shift_type_id: shiftType1.id,
            availability: {
              create: [
                {
                  weekday: 5,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  }
                },
                {
                  weekday: 6,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                },
                {
                  id: availabilityId + "3",
                  weekday: 7,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                }
              ]
            }
          }
        }
      }
    })
  );

  await Promise.all(users);

  // mockdata voor shifts
  const shifts = [];

  // dinsdag
  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-25T11:45:00.000Z",
          end: "2023-04-25T15:00:00.000Z"
        }
      }
    )
  );

  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-25T14:00:00.000Z",
          end: "2023-04-25T17:15:00.000Z"
        }
      }
    )
  );

  // woensdag
  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-26T11:45:00.000Z",
          end: "2023-04-26T15:00:00.000Z"
        }
      }
    )
  );

  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-26T14:00:00.000Z",
          end: "2023-04-26T17:15:00.000Z"
        }
      }
    )
  );

  // donderdag
  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-27T11:45:00.000Z",
          end: "2023-04-27T15:00:00.000Z"
        }
      }
    )
  );

  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-27T14:00:00.000Z",
          end: "2023-04-27T17:15:00.000Z"
        }
      }
    )
  );

  // vrijdag
  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-28T11:45:00.000Z",
          end: "2023-04-28T15:00:00.000Z"
        }
      }
    )
  );

  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-28T14:00:00.000Z",
          end: "2023-04-28T17:15:00.000Z"
        }
      }
    )
  );

  // zaterdag
  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-29T11:45:00.000Z",
          end: "2023-04-29T17:15:00.000Z"
        }
      }
    )
  );

  // zondag
  shifts.push(
    prisma.shift.create({
        data: {
          start: "2023-04-30T11:45:00.000Z",
          end: "2023-04-30T17:15:00.000Z"
        }
      }
    )
  );

  const createdShifts = await Promise.all(shifts);

// Genereer mockdata voor staff_required
  // willen we alleen balie rooster genereren of ook galerie (in het algemeen maar atm. voor demo)? Alles staat hier voorlopig op balie
  const staffRequiredList = [];

  // dinsdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[0].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[1].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // woensdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[2].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[3].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // donderdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[4].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[5].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // vrijdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[6].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[7].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // zaterdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 2,
        shift_id: createdShifts[8].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // zondag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 2,
        shift_id: createdShifts[9].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  await Promise.all(staffRequiredList);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
