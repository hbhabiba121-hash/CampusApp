import * as SQLite from 'expo-sqlite';

export type Student = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;  // Changé pour accepter string ou null
};

// Type pour l'insertion (sans l'id qui est auto-généré)
export type NewStudent = {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
};

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('campus.db');
      
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          role TEXT NOT NULL,
          avatar TEXT
        );
      `);
      
      console.log('Database initialized successfully');
      
      // Vérifier si la table est vide et ajouter des données par défaut si nécessaire
      const count = await this.getCount();
      if (count === 0) {
        await this.insertDefaultStudents();
      }
      
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    }
  }

  async getCount(): Promise<number> {
    if (!this.db) return 0;
    try {
      const result = await this.db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM students'
      );
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting count:', error);
      return 0;
    }
  }

  async insertDefaultStudents() {
    const defaultStudents = [
      { name: 'Alice Martin', email: 'alice@campus.com', role: 'Étudiant' },
      { name: 'Bob Dupont', email: 'bob@campus.com', role: 'Étudiant' },
      { name: 'Charlie Lambert', email: 'charlie@campus.com', role: 'Étudiant' },
      { name: 'Diana Prince', email: 'diana@campus.com', role: 'Étudiant' },
    ];

    for (const student of defaultStudents) {
      await this.addStudent(student);
    }
  }

  async getAllStudents(): Promise<Student[]> {
    if (!this.db) return [];
    
    try {
      const rows = await this.db.getAllAsync<any>(
        'SELECT * FROM students ORDER BY name ASC'
      );
      
      return rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        avatar: row.avatar || null
      }));
    } catch (error) {
      console.error('Error getting students:', error);
      return [];
    }
  }

  async addStudent(student: { name: string; email: string; role?: string }): Promise<Student | null> {
    if (!this.db) return null;
    
    try {
      const role = student.role || 'Étudiant';
      
      const result = await this.db.runAsync(
        'INSERT INTO students (name, email, role) VALUES (?, ?, ?)',
        student.name,
        student.email,
        role
      );
      
      // Récupérer l'étudiant ajouté
      const newStudent = await this.db.getFirstAsync<any>(
        'SELECT * FROM students WHERE id = ?',
        result.lastInsertRowId
      );
      
      if (newStudent) {
        return {
          id: newStudent.id,
          name: newStudent.name,
          email: newStudent.email,
          role: newStudent.role,
          avatar: newStudent.avatar || null
        };
      }
      return null;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }

  async updateStudent(id: number, updates: { name?: string; email?: string; role?: string }): Promise<boolean> {
    if (!this.db) return false;
    
    try {
      const student = await this.db.getFirstAsync<any>('SELECT * FROM students WHERE id = ?', id);
      if (!student) return false;
      
      const name = updates.name ?? student.name;
      const email = updates.email ?? student.email;
      const role = updates.role ?? student.role;
      
      await this.db.runAsync(
        'UPDATE students SET name = ?, email = ?, role = ? WHERE id = ?',
        name,
        email,
        role,
        id
      );
      
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      return false;
    }
  }

  async deleteStudent(id: number): Promise<boolean> {
    if (!this.db) return false;
    
    try {
      await this.db.runAsync('DELETE FROM students WHERE id = ?', id);
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  }

  async searchStudents(query: string): Promise<Student[]> {
    if (!this.db) return [];
    
    try {
      const rows = await this.db.getAllAsync<any>(
        'SELECT * FROM students WHERE name LIKE ? OR email LIKE ? ORDER BY name ASC',
        `%${query}%`,
        `%${query}%`
      );
      
      return rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        avatar: row.avatar || null
      }));
    } catch (error) {
      console.error('Error searching students:', error);
      return [];
    }
  }

  async close() {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default new DatabaseService();