// Contoh penggunaan GraphQL API untuk Karyawan CRUD

// ==========================================
// 1. QUERIES
// ==========================================

// Get all karyawan with full relations
const GET_ALL_KARYAWAN = `
  query {
    karyawans {
      id
      nik
      NamaLengkap
      alamat
      noTelp
      tanggalMasukKaryawan
      departemen {
        id
        namaDepartemen
      }
      vendor {
        id
        namaVendor
      }
      gajiPokok {
        id
        jumlahGaji
      }
    }
  }
`;
  
// Get single karyawan by ID
const GET_KARYAWAN = `
  query GetKaryawan($id: String!) {
    karyawan(id: $id) {
      id
      nik
      NamaLengkap
      alamat
      noTelp
      tanggalMasukKaryawan
      departemen {
        namaDepartemen
      }
      vendor {
        namaVendor
      }
      gajiPokok {
        jumlahGaji
      }
    }
  }
`;

// Get master data for form
const GET_MASTER_DATA = `
  query {
    departemens {
      id
      namaDepartemen
    }
    vendors {
      id
      namaVendor
    }
    gajiPokoks {
      id
      jumlahGaji
    }
  }
`;

// ==========================================
// 2. MUTATIONS
// ==========================================

// Create new karyawan
const CREATE_KARYAWAN = `
  mutation CreateKaryawan($input: CreateKaryawanInput!) {
    createKaryawan(input: $input) {
      id
      nik
      NamaLengkap
      departemen {
        namaDepartemen
      }
      vendor {
        namaVendor
      }
    }
  }
`;

// Update existing karyawan
const UPDATE_KARYAWAN = `
  mutation UpdateKaryawan($id: String!, $input: UpdateKaryawanInput!) {
    updateKaryawan(id: $id, input: $input) {
      id
      nik
      NamaLengkap
      alamat
      noTelp
      tanggalMasukKaryawan
    }
  }
`;

// Delete karyawan
const DELETE_KARYAWAN = `
  mutation DeleteKaryawan($id: String!) {
    deleteKaryawan(id: $id) {
      id
      nik
      NamaLengkap
    }
  }
`;

// ==========================================
// 3. USAGE EXAMPLES
// ==========================================

async function fetchAllKaryawan() {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_ALL_KARYAWAN }),
  });
  
  const result = await response.json();
  
  if (result.errors) {
    console.error(result.errors);
    return null;
  }
  
  return result.data.karyawans;
}

async function createKaryawan(input: {
  nik: string;
  NamaLengkap: string;
  alamat: string;
  noTelp: string;
  tanggalMasukKaryawan: string;
  departemenId: string;
  vendorId: string;
  gajiPokokId: string;
}) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: CREATE_KARYAWAN,
      variables: { input },
    }),
  });
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data.createKaryawan;
}

async function updateKaryawan(id: string, input: Partial<{
  nik: string;
  NamaLengkap: string;
  alamat: string;
  noTelp: string;
  tanggalMasukKaryawan: string;
  departemenId: string;
  vendorId: string;
  gajiPokokId: string;
}>) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: UPDATE_KARYAWAN,
      variables: { id, input },
    }),
  });
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data.updateKaryawan;
}

async function deleteKaryawan(id: string) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: DELETE_KARYAWAN,
      variables: { id },
    }),
  });
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data.deleteKaryawan;
}

// ==========================================
// 4. REACT HOOK EXAMPLE
// ==========================================

function useKaryawan() {
  const [karyawans, setKaryawans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchKaryawans = async () => {
    setLoading(true);
    try {
      const data = await fetchAllKaryawan();
      setKaryawans(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchKaryawans();
  }, []);

  return {
    karyawans,
    loading,
    error,
    refetch: fetchKaryawans,
  };
}

// ==========================================
// 5. CURL EXAMPLES
// ==========================================

/*
# Fetch all karyawan
curl -X POST http://localhost:3001/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ karyawans { id nik NamaLengkap departemen { namaDepartemen } } }"
  }'

# Create karyawan
curl -X POST http://localhost:3001/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation($input: CreateKaryawanInput!) { createKaryawan(input: $input) { id nik NamaLengkap } }",
    "variables": {
      "input": {
        "nik": "EMP001",
        "NamaLengkap": "John Doe",
        "alamat": "Jakarta Selatan",
        "noTelp": "08123456789",
        "tanggalMasukKaryawan": "2025-01-01",
        "departemenId": "clxxx",
        "vendorId": "clyyy",
        "gajiPokokId": "clzzz"
      }
    }
  }'

# Update karyawan
curl -X POST http://localhost:3001/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation($id: String!, $input: UpdateKaryawanInput!) { updateKaryawan(id: $id, input: $input) { id NamaLengkap } }",
    "variables": {
      "id": "clxxx",
      "input": {
        "NamaLengkap": "Jane Doe",
        "alamat": "Jakarta Utara"
      }
    }
  }'

# Delete karyawan
curl -X POST http://localhost:3001/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation($id: String!) { deleteKaryawan(id: $id) { id nik } }",
    "variables": {
      "id": "clxxx"
    }
  }'
*/

// ==========================================
// 6. ERROR HANDLING
// ==========================================

async function handleGraphQLRequest(query: string, variables?: any) {
  try {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    // Check for GraphQL errors
    if (result.errors) {
      const errorMessage = result.errors[0].message;
      
      // Handle specific errors
      if (errorMessage.includes('NIK sudah terdaftar')) {
        throw new Error('NIK ini sudah digunakan oleh karyawan lain');
      }
      
      if (errorMessage.includes('Nomor telepon sudah terdaftar')) {
        throw new Error('Nomor telepon ini sudah digunakan');
      }
      
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
}

export {
  GET_ALL_KARYAWAN,
  GET_KARYAWAN,
  GET_MASTER_DATA,
  CREATE_KARYAWAN,
  UPDATE_KARYAWAN,
  DELETE_KARYAWAN,
  fetchAllKaryawan,
  createKaryawan,
  updateKaryawan,
  deleteKaryawan,
  useKaryawan,
  handleGraphQLRequest,
};
