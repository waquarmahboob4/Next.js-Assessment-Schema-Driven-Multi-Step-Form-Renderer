import { FormSchema } from '@/lib/types';

export const propertyFormSchema: FormSchema = {
  "steps": [
    {
      "title": "User Details",
      "fields": [
        {
          "key": "fullName",
          "label": "Full Name",
          "type": "text",
          "required": true
        },
        {
          "key": "email",
          "label": "Email",
          "type": "text",
          "required": true
        },
        {
          "key": "phone",
          "label": "Phone Number",
          "type": "group",
          "fields": [
            {
              "key": "countryCode",
              "label": "Country Code",
              "type": "select",
              "options": [
                "+971",
                "+966",
                "+1",
                "+44"
              ],
              "required": true
            },
            {
              "key": "number",
              "label": "Phone Number",
              "type": "text",
              "required": true
            }
          ]
        }
      ]
    },
    {
      "title": "Property Info",
      "fields": [
        {
          "key": "propertyType",
          "label": "Property Type",
          "type": "select",
          "options": [
            "Residential",
            "Commercial"
          ],
          "required": true
        },
        {
          "key": "category",
          "label": "Category",
          "type": "select",
          "required": true,
          "optionSource": {
            "key": "propertyType",
            "map": {
              "Residential": [
                "Apartment",
                "Villa",
                "Townhouse"
              ],
              "Commercial": [
                "Office",
                "Retail",
                "Warehouse"
              ]
            }
          },
          "dependencies": [
            {
              "key": "propertyType",
              "notEmpty": true
            }
          ]
        },
        {
          "key": "subCategory",
          "label": "Subcategory",
          "type": "select",
          "required": true,
          "optionSource": {
            "key": "category",
            "map": {
              "Apartment": [
                "Studio",
                "1BR",
                "2BR",
                "Penthouse"
              ],
              "Villa": [
                "3BR",
                "4BR",
                "5BR+"
              ],
              "Office": [
                "Shell & Core",
                "Fitted",
                "Partitioned"
              ],
              "Retail": [
                "Street-Facing",
                "Mall-Unit"
              ],
              "Warehouse": [
                "Cold Storage",
                "Dry Storage"
              ]
            }
          },
          "dependencies": [
            {
              "key": "category",
              "notEmpty": true
            }
          ]
        },
        {
          "key": "size",
          "label": "Size (sqm)",
          "type": "number",
          "required": true
        }
      ]
    },
    {
      "title": "Location & Amenities",
      "fields": [
        {
          "key": "location",
          "label": "Location",
          "type": "text",
          "required": true
        },
        {
          "key": "hasParking",
          "label": "Parking Available?",
          "type": "checkbox"
        },
        {
          "key": "parkingSpots",
          "label": "Number of Parking Spots",
          "type": "number",
          "dependencies": [
            {
              "key": "hasParking",
              "equals": true
            }
          ]
        },
        {
          "key": "amenities",
          "label": "Amenities",
          "type": "group",
          "fields": [
            {
              "key": "hasPool",
              "label": "Pool",
              "type": "checkbox"
            },
            {
              "key": "hasGym",
              "label": "Gym",
              "type": "checkbox"
            },
            {
              "key": "hasBalcony",
              "label": "Balcony",
              "type": "checkbox"
            }
          ]
        }
      ]
    },
    {
      "title": "Finish",
      "fields": []
    }
  ]
};