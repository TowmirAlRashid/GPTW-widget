import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";

import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { Controller, useForm } from 'react-hook-form';

import { useEffect } from "react";
import { useState } from "react";

import Logo from "./assets/Logo.svg"

const ZOHO = window.ZOHO;


function App() {
  const [initialized, setInitialized] = useState(false) // initialize the widget
  const [entity, setEntity] = useState() // gets the entity
  const [entityId, setEntityId] = useState() // gets the current entity id

  const [dealData, setDealData] = useState() // gets the deal data
  const [users, setUsers] = useState() // gets all the users

  const { control, handleSubmit } = useForm();

  const [statusMessages, setStatusMessages] = useState([
    {
      name: "Closing Date",
      confirm: false,
      update: false
    },
  ])

  useEffect(() => { // rendered on the first page load
    ZOHO.embeddedApp.on("PageLoad", function (data) { 
      ZOHO.CRM.UI.Resize({height:"1000",width:"1200"})

      setInitialized(true)

      setEntity(data?.Entity);
      if(data.ButtonPosition === "DetailView"){
        setEntityId(data?.EntityId?.[0])
      } else {
        setEntityId(data?.EntityId)
      }
    });

    ZOHO.embeddedApp.init();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if(initialized){
        const dealResp = await ZOHO.CRM.API.getRecord({Entity: entity, RecordID: entityId})
        setDealData(dealResp?.data?.[0])

        // console.log(dealData)

        const allUsersResp = await ZOHO.CRM.API.getAllUsers({Type:"AllUsers"});
        setUsers(allUsersResp?.users?.filter(user => user?.status === "active").map(user => {
          return {
            name: user?.full_name,
            id: user?.id
          }
        }))
      }
    }

    fetchData()
  }, [initialized])

  

  const productOptions = ["-None-", "Assess", "Accelerate Local", "Accelerate Global", "Analyze", "Accelerate", "Accelerate + GO", "Benchmarks", "Culture Coaching", "Manager's Access", "Event or Sponsorship", "To be determined"]

  const typeOptions = ["-None-", "New Business", "Upgrade - Same Year", "Renewal - Upgrade Tier", "Renewal - Downgrade Tier", "Renewal - Same Tier", "Event or Sponsorship"]

  const discountOfferOptions = ["-None-", "Yes", "No"]

  if(dealData && users){
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          p: "2rem 1rem 1.5rem"
        }}
      >
        <Box  // top logo and title
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            mb: "1.5rem"
          }}
        >
          <Box
            sx={{
              width: "50px",
              height: "50px"
            }}
          ><img src={Logo} alt="logo" /></Box>
  
          <Typography variant="h6" fontWeight="bold">
            Verify the Details below before making this deal as Closed-Won
          </Typography>
        </Box>
  
        <Box // holds the data fields and summary
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            mb: "2rem"
          }}
        >
          <Box // holds the data fields
            sx={{
              width: "75%",
              borderRight: "2px solid black",
              p: "1rem 1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem"
            }}
          >
            <Box  // closing date
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Closing Date
              </Typography>
  
              <Controller 
                name="Closing_Date"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                      inputFormat="YYYY/MM/DD"
                      onChange={(newValue) => field.onChange(dayjs(newValue).format('YYYY/MM/DD'))}
                      {...field}
                      value={dealData?.Closing_Date}
                      renderInput={(params) => <TextField 
                        {...params}
                        sx={{ 
                          width: "52%" ,
                          "& .MuiInputBase-input": {
                            padding: "8px 10px !important"
                          }
                        }}
                      />}
                    />
                  </LocalizationProvider>
                )}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>
  
            <Box  // product
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Product
              </Typography>
  
              <Controller
                name="Product"
                control={control}
                defaultValue={dealData?.Product}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={productOptions}
                      getOptionLabel={(option) => option}
                      onChange={(_, data) => {
                        field.onChange(data)
                      }}
                      sx={{ 
                        width: "52%" ,
                        "& .MuiInputBase-input": {
                          padding: "8px 10px !important"
                        },
                        "& .MuiOutlinedInput-root": {
                          padding: "0 !important"
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params}
                        />
                      )}
                    />
                  )
                }}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>
  
            <Box  // type
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Type
              </Typography>

              <Controller
                name="Type"
                control={control}
                defaultValue={dealData?.Type}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={typeOptions}
                      getOptionLabel={(option) => option}
                      onChange={(_, data) => {
                        field.onChange(data)
                      }}
                      sx={{ 
                        width: "52%" ,
                        "& .MuiInputBase-input": {
                          padding: "8px 10px !important"
                        },
                        "& .MuiOutlinedInput-root": {
                          padding: "0 !important"
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params}
                        />
                      )}
                    />
                  )
                }}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>
  
            <Box  // amount
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Amount
              </Typography>

              <Controller
                control={control}
                name="Amount"
                render={({ field }) => (
                  <TextField
                    id="name"
                    variant="outlined"
                    {...field}
                    sx={{ 
                      width: "52%" ,
                      "& .MuiInputBase-input": {
                        padding: "8px 10px !important"
                      }
                    }}
                    value={dealData?.Amount}
                  />
                )}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>
  
            <Box  // discount offered
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Discount Offered?
              </Typography>

              <Controller
                name="Discount_Offered"
                control={control}
                defaultValue={dealData?.Discount_Offered}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={discountOfferOptions}
                      getOptionLabel={(option) => option}
                      onChange={(_, data) => {
                        field.onChange(data)
                      }}
                      sx={{ 
                        width: "52%" ,
                        "& .MuiInputBase-input": {
                          padding: "8px 10px !important"
                        },
                        "& .MuiOutlinedInput-root": {
                          padding: "0 !important"
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params}
                        />
                      )}
                    />
                  )
                }}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>

            <Box  // discount amount
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Discount Amount
              </Typography>

              <Controller
                control={control}
                name="Discount_Amount"
                render={({ field }) => (
                  <TextField
                    id="name"
                    variant="outlined"
                    {...field}
                    sx={{ 
                      width: "52%" ,
                      "& .MuiInputBase-input": {
                        padding: "8px 10px !important"
                      }
                    }}
                    value={dealData?.Discount_Amount}
                  />
                )}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>

            <Box  // discount reason
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Discount Reason
              </Typography>

              <Controller
                control={control}
                name="Discount_Reason"
                render={({ field }) => (
                  <TextField
                    id="name"
                    variant="outlined"
                    {...field}
                    sx={{ 
                      width: "52%" ,
                      "& .MuiInputBase-input": {
                        padding: "8px 10px !important"
                      }
                    }}
                    value={dealData?.Discount_Reason}
                  />
                )}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>

            <Box  // csm
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                CSM
              </Typography>

              <Controller
                name="CSM"
                control={control}
                defaultValue={{name: dealData?.CSM?.name, id: dealData?.CSM?.id}}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={users}
                      getOptionLabel={(option) => option?.name}
                      onChange={(_, data) => {
                        field.onChange({ name: data?.name, id: data?.id })
                      }}
                      sx={{ 
                        width: "52%" ,
                        "& .MuiInputBase-input": {
                          padding: "8px 10px !important"
                        },
                        "& .MuiOutlinedInput-root": {
                          padding: "0 !important"
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params}
                        />
                      )}
                    />
                  )
                }}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>

            <Box  // culture coaching required
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Culture Coaching Required?
              </Typography>

              <Controller
                name="Culture_Coaching_Required"
                control={control}
                defaultValue={dealData?.Culture_Coaching_Required}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={discountOfferOptions}
                      getOptionLabel={(option) => option}
                      onChange={(_, data) => {
                        field.onChange(data)
                      }}
                      sx={{ 
                        width: "52%" ,
                        "& .MuiInputBase-input": {
                          padding: "8px 10px !important"
                        },
                        "& .MuiOutlinedInput-root": {
                          padding: "0 !important"
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params}
                        />
                      )}
                    />
                  )
                }}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>

            <Box  // additional culture coaching details
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Additional Culture Coaching Details
              </Typography>

              <Controller
                control={control}
                name="Additional_Culture_Coaching_Details"
                render={({ field }) => (
                  <TextField
                    id="name"
                    variant="outlined"
                    {...field}
                    sx={{ 
                      width: "52%" ,
                      "& .MuiInputBase-input": {
                        padding: "8px 10px !important"
                      }
                    }}
                    value={dealData?.Additional_Culture_Coaching_Details}
                  />
                )}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>

            <Box  // additional consulting details
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Additional Consulting Details
              </Typography>

              <Controller
                control={control}
                name="Additional_Consulting_Details"
                render={({ field }) => (
                  <TextField
                    id="name"
                    variant="outlined"
                    {...field}
                    sx={{ 
                      width: "52%" ,
                      "& .MuiInputBase-input": {
                        padding: "8px 10px !important"
                      }
                    }}
                    value={dealData?.Additional_Consulting_Details}
                  />
                )}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>

            <Box  // manager access included
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem"
              }}
            >
              <Typography variant="p" sx={{ width: "20%" }} component="label">
                Manager Access Included?
              </Typography>

              <Controller
                name="Manager_Access_Included"
                control={control}
                defaultValue={dealData?.Manager_Access_Included}
                render={({ field }) => {
                  return (
                    <Autocomplete
                      {...field}
                      disablePortal
                      options={discountOfferOptions}
                      getOptionLabel={(option) => option}
                      onChange={(_, data) => {
                        field.onChange(data)
                      }}
                      sx={{ 
                        width: "52%" ,
                        "& .MuiInputBase-input": {
                          padding: "8px 10px !important"
                        },
                        "& .MuiOutlinedInput-root": {
                          padding: "0 !important"
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                          {...params}
                        />
                      )}
                    />
                  )
                }}
              />
  
              <Box 
                sx={{ 
                  width: "24%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem"
                }}
              >
                <Button 
                  sx={{ backgroundColor: "#b6d7a8", "&:hover": {backgroundColor: "#b6d7a8"}, color: "black" }}
                  // onClick={() => setStatusMessages({
                  //   ...statusMessages,
                  //   Closing_Date: {
                  //     confirm: true,
                  //     update: false
                  //   }
                  // })}
                >
                  Confirm
                </Button>
                <Button sx={{ backgroundColor: "#ffe599", "&:hover": {backgroundColor: "#ffe599"}, color: "black" }}>Update</Button>
              </Box>
            </Box>
          </Box>
  
          <Box // holds the summary
            sx={{
              width: "25%",
              p: "0 1rem"
            }}
          >
            <Typography variant="p" fontWeight="bold" sx={{ mb: "1.5rem" }}>
              Summary
            </Typography>
  
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              {
                statusMessages?.filter(statusMessage => statusMessage?.confirm === true || statusMessage?.update === true)
                .map(statusMessage => {
                  return (
                    <Typography>
                      {statusMessage?.name} is {statusMessage?.confirm === true ? "Confirmed": statusMessage?.update === true ? "Updated" : null}
                    </Typography>
                  )
                })
              }
            </Box>
          </Box>
        </Box>
  
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            mb: "1.5rem"
          }}
        >
          <Button sx={{ backgroundColor: "#009e0f", "&:hover": {backgroundColor: "#009e0f"}, color: "white" }}>Mark this Deal Closed-Won</Button>
        </Box>
      </Box>
    );
  } else {
    return (
      <h1>Loading...</h1>
    )
  }
}

export default App;
