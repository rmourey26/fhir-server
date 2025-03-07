# GraphQL Support in FHIR Server

This FHIR server implements support for querying FHIR data using GraphQL(https://graphql.org/).

### High Level Sequence

[![](https://mermaid.ink/img/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gICAgQnJvd3Nlci0-PitBV1NDb2duaXRvOiBBdXRoZW50aWNhdGVcbiAgICBBV1NDb2duaXRvLT4-K0Jyb3dzZXI6IFNlbmQgYmVhcmVyIHRva2VuXG4gICAgQnJvd3Nlci0-PitGSElSU2VydmVyOiBHcmFwaFFMIFJlcXVlc3RcbiAgICBGSElSU2VydmVyLT4-K0NvbW1vbkNvZGU6IEF1dGhvcml6ZSAmIFJlcXVlc3QgZGF0YVxuICAgIENvbW1vbkNvZGUtPj4rTW9uZ29EYjogU2VuZCBxdWVyeVxuICAgIE1vbmdvREItPj4rQ29tbW9uQ29kZTogUmV0dXJuIGRhdGFcbiAgICBDb21tb25Db2RlLT4-K0ZISVJTZXJ2ZXI6IFJldHVybiBkYXRhXG4gICAgRkhJUlNlcnZlci0-PitCcm93c2VyOiBSZXR1cm4gZGF0YVxuXG4gICAgICAgICAgICAiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGFyayJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)](https://mermaid.live/edit#eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gICAgQnJvd3Nlci0-PitBV1NDb2duaXRvOiBBdXRoZW50aWNhdGVcbiAgICBBV1NDb2duaXRvLT4-K0Jyb3dzZXI6IFNlbmQgYmVhcmVyIHRva2VuXG4gICAgQnJvd3Nlci0-PitGSElSU2VydmVyOiBHcmFwaFFMIFJlcXVlc3RcbiAgICBGSElSU2VydmVyLT4-K0NvbW1vbkNvZGU6IEF1dGhvcml6ZSAmIFJlcXVlc3QgZGF0YVxuICAgIENvbW1vbkNvZGUtPj4rTW9uZ29EYjogU2VuZCBxdWVyeVxuICAgIE1vbmdvREItPj4rQ29tbW9uQ29kZTogUmV0dXJuIGRhdGFcbiAgICBDb21tb25Db2RlLT4-K0ZISVJTZXJ2ZXI6IFJldHVybiBkYXRhXG4gICAgRkhJUlNlcnZlci0-PitCcm93c2VyOiBSZXR1cm4gZGF0YVxuXG4gICAgICAgICAgICAiLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGFya1wiXG59IiwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)

### Playground

You can access the GraphQL playground by going to the /graphql url in your browser e.g., http://fhir.dev.bwell.zone/graphqlv2. This will redirect you to the OAuth provider to login and then will store your JWT token in a cookie so you can use the Playground.

### Making GraphQL calls to the server

You can use the standard GraphQL client libraries or Postman and access the /graphql url. You will need to pass the OAuth token as a Bearer token to authenticate. See https://github.com/icanbwell/fhir-server/blob/master/security.md for details.

### Documentation

All the GraphQL entities and properties have inline documentation from FHIR specifications

### Sample GraphQL query

```graphql
query {
    entry {
        resource {
            practitionerRole {
                id
                practitioner {
                    name {
                        family
                        given
                    }
                }
                organization {
                    name
                }
                healthcareService {
                    name
                }
                location {
                    name
                }
            }
        }
    }
}
```

### Sample Python Code

```python
import requests
import json

url = "https://fhir.dev.bwell.zone/graphqlv2"

payload="{\"query\":\"query {\\n entry {\\n resource {\\n  practitionerRole {\\n    id\\n    practitioner {\\n      name {\\n        family\\n        given\\n      }\\n    }\\n    organization {\\n      name\\n    }\\n    healthcareService {\\n      name\\n    }\\n    location {\\n      name\\n    }\\n  }\\n}\\n}\\n}\",\"variables\":{}}"
headers = {
  'Authorization': 'Bearer {put token here}',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```

### Sample Node.js code

```javascript
var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
    method: 'POST',
    hostname: 'fhir.dev.bwell.zone',
    path: '/graphqlv2',
    headers: {
        Authorization: 'Bearer {put token here}',
        'Content-Type': 'application/json',
    },
    maxRedirects: 20,
};

var req = https.request(options, function (res) {
    var chunks = [];

    res.on('data', function (chunk) {
        chunks.push(chunk);
    });

    res.on('end', function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });

    res.on('error', function (error) {
        console.error(error);
    });
});

var postData = JSON.stringify({
    query: `query {
    entry {
        resource {
            practitionerRole {
                id
                practitioner {
                    name {
                        family
                        given
                    }
                }
                organization {
                    name
                }
                healthcareService {
                    name
                }
                location {
                    name
                }
            }
        }
    }
}`,
    variables: {},
});

req.write(postData);

req.end();
```

### Sample cUrl Code

```shell
curl --location --request POST 'https://fhir.dev.bwell.zone/graphqlv2' \
--header 'Authorization: Bearer {put token here}' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {\n entry {\n resource {\n  practitionerRole {\n    id\n    practitioner {\n      name {\n        family\n        given\n      }\n    }\n    organization {\n      name\n    }\n    healthcareService {\n      name\n    }\n    location {\n      name\n    }\n  }\n}\n}\n}","variables":{}}'
```

### Querying union types

Querying union types require the following syntax (https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/#querying-a-union):

```
provider {
            __typename
            ... on Organization {
                id
                identifier {
                    system
                    value
                }
            }
            ... on Practitioner {
                id
                name {
                    family
                    given
                }
            }
        }
```

### GraphQL Server Implementation

We use the apollo-server-express framework to implement the GraphQL middleware. This is implemented in
https://github.com/icanbwell/fhir-server/blob/master/src/middleware/graphqlServer.js

We use the graphql-tools framework, so we can store the schema and resolver for each FHIR entity in a separate file and then merge them together to create the full schema.

### Security

For security, we use the same mechanism for both REST and GraphQL. There are two pieces to this:

1. The middleware to read auth tokens, decrypt them and add `request.user` and `request.scope`: https://github.com/icanbwell/fhir-server/blob/master/src/strategies/jwt.bearer.strategy.js
2. code to check these permissions when needed. This code is stored in the https://github.com/icanbwell/fhir-server/tree/master/src/operations

### Code Generation

We use a code generator to read the FHIR schema and generate the GraphQL schema and resolvers. This code generator is in https://github.com/icanbwell/fhir-server/blob/master/src/fhir/generator/generate_graphql_classes.py and can be run by typing the command `make graphql`.

In the https://github.com/icanbwell/fhir-server/tree/master/src/graphql/v2/schemas folder each FHIR entity has its own GraphQL schema file. The schema.graphql file is the top level schema element.
In the https://github.com/icanbwell/fhir-server/tree/master/src/graphql/v2/resolvers folder each FHIR resource has its own GraphQL resolver file. The resolvers.js merges all the resolvers together.

### FHIR References

This FHIR server automatically turns each reference into a nested access to the referenced resource.

### Adding reverse links

To add a reverse link:

1. Add a custom schema file (e.g., https://github.com/icanbwell/fhir-server/blob/master/src/graphql/v2/schemas/custom/patient.graphql)
2. Add a custom resolver file (e.g., https://github.com/icanbwell/fhir-server/blob/master/src/graphql/v2/resolvers/custom/patient.js)

The FHIR server will automatically load these the next time it runs.

### Adding Enrichment Providers

Sometimes you want to add enrichment to the underlying FHIR data (e.g., calculating totals, adding additional properties etc). To enable this we have a concept of pluggable enrichment providers.

To add a new enrichment provider:

1. Add a new provider class here: https://github.com/icanbwell/fhir-server/tree/master/src/enrich/providers. You can see examples in here. Implement the interface.
2. Register your new provider in https://github.com/icanbwell/fhir-server/tree/master/src/createContainer.js
   Now this enrichment provider will be run for every resource and can add additional properties. These properties are available both when accessing the server via REST or GraphQL.

### Upgrading from graphqlv1 to graphqlv2
In GraphQLv2, the resources are now returned as a FHIR Bundle.

GraphQLv1:
```graphql
query {
    practitionerRole {
        id
    }
}    
```

Graphqlv2:
```graphql
query {
    entry {
        resource {
            practitionerRole {
                id
            }
        }
    }
}    
```

### Enable Strict variable validation

Pass the header `handling=strict` to enable strict variable validation. The FHIR Server will return a validation error if the query variables present in the GraphQL query do not have corresponding values in the request. Default value of the header is `lenient` skipping this validation. This is in addition to [Enabling Strict Validation in Search Requests](https://github.com/icanbwell/fhir-server/blob/master/cheatsheet.md#18-enabling-strict-validation).
